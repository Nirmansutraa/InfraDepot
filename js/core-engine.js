// ================= IMPORTS =================
import { db, storage, collection, addDoc, ref, uploadString, getDownloadURL, serverTimestamp } from "./firebase-config.js";

// ================= GLOBAL STATE =================
let photos = [];
let trackingId = "";
let map, marker;
let dbLocal;

// ================= 1. INITIALIZATION =================
window.addEventListener("DOMContentLoaded", () => {
    // Generate Tracking ID
    trackingId = "ID-" + Date.now();
    const idBox = document.getElementById("trackingIdBox");
    if(idBox) idBox.innerText = trackingId;

    // WhatsApp Auto Sync Logic
    ["owner", "manager"].forEach(type => {
        const phoneInput = document.getElementById(type + "Phone");
        const waInput = document.getElementById(type + "Whatsapp");
        
        if(phoneInput && waInput) {
            phoneInput.addEventListener("input", () => {
                if (!waInput.dataset.modified) {
                    waInput.value = phoneInput.value;
                }
            });
            waInput.addEventListener("input", function() {
                this.dataset.modified = "true";
            });
        }
    });

    initMap();
    initIndexedDB();
});

// ================= 2. MAP ENGINE (SAFE) =================
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || map) return; // Prevent double initialization

    map = L.map('map').setView([24.5854, 73.7125], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

window.captureGPS = async function() {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        document.getElementById("coordinates").value = lat + "," + lng;

        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 16);

        // Reverse Geocode (Address Fetch)
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            const addrInput = document.getElementById("address");
            if(addrInput) addrInput.value = data.display_name || "Address found";
        } catch (err) {
            console.error("Address fetch failed", err);
        }
    }, err => alert("GPS Error: " + err.message));
};

// ================= 3. IMAGE COMPRESSION & HANDLING =================
window.handlePhoto = function(e) {
    if (photos.length >= 10) return alert("Max 10 photos allowed");

    const file = e.target.files[0];
    if (!file) return;

    compressImage(file).then(base64 => {
        photos.push({
            img: base64,
            time: new Date().toISOString(),
            gps: document.getElementById("coordinates").value
        });
        renderPhotos();
    });
};

function compressImage(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const scale = 0.6; 
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.7));
            };
        };
    });
}

function renderPhotos() {
    const div = document.getElementById("photoPreview");
    if(!div) return;
    div.innerHTML = "";
    photos.forEach(p => {
        const img = document.createElement("img");
        img.src = p.img;
        img.className = "w-16 h-16 rounded object-cover border border-orange-400";
        div.appendChild(img);
    });
}

// ================= 4. DATA COLLECTION (SCRAPER) =================
function getFormData() {
    // Scrape Materials Hierarchy
    const selectedMaterials = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
        category: el.closest('.variety-box').id.replace('var_', ''),
        variety: el.dataset.parent,
        brand: el.value
    }));

    // Scrape Fleet Data
    const fleetData = {};
    document.querySelectorAll('.fleet-val').forEach(el => {
        fleetData[el.dataset.name] = parseInt(el.innerText);
    });

    return {
        trackingId: trackingId,
        firmName: document.getElementById("firmName").value,
        owner: {
            name: document.getElementById("ownerName").value,
            phone: document.getElementById("ownerPhone").value,
            whatsapp: document.getElementById("ownerWhatsapp").value
        },
        manager: {
            name: document.getElementById("managerName").value,
            phone: document.getElementById("managerPhone").value,
            whatsapp: document.getElementById("managerWhatsapp").value
        },
        location: {
            coords: document.getElementById("coordinates").value,
            address: document.getElementById("address").value
        },
        materials: selectedMaterials,
        fleet: fleetData,
        timestamp: new Date().toISOString(),
        serverTime: serverTimestamp()
    };
}

// ================= 5. CLOUD SYNC & OFFLINE =================
async function uploadToFirebase(data) {
    // 1. Upload compressed photos to Storage
    let uploadedPhotoUrls = [];
    for (let i = 0; i < photos.length; i++) {
        const storageRef = ref(storage, `surveys/${trackingId}/photo_${i}.jpg`);
        await uploadString(storageRef, photos[i].img, 'data_url');
        const url = await getDownloadURL(storageRef);
        uploadedPhotoUrls.push(url);
    }
    data.photos = uploadedPhotoUrls;

    // 2. Save document to Firestore
    await addDoc(collection(db, "field_data"), data);
}

window.syncCloud = async function() {
    const btn = document.getElementById("syncBtn");
    if(!document.getElementById("firmName").value) return alert("Firm Name Required");

    try {
        btn.innerText = "⌛ SYNCING...";
        btn.disabled = true;

        const data = getFormData();
        await uploadToFirebase(data);

        alert("🚀 Cloud Sync Successful!");
        location.reload();
    } catch (err) {
        console.error(err);
        alert("❌ Sync Failed. Data saved locally.");
        saveLocal();
        btn.innerText = "🚀 SUBMIT SYNC";
        btn.disabled = false;
    }
};

// ================= 6. INDEXED DB (LOCAL STORAGE) =================
function initIndexedDB() {
    const req = indexedDB.open("InfraDepotLocal", 1);
    req.onupgradeneeded = e => {
        dbLocal = e.target.result;
        dbLocal.createObjectStore("offline_queue", { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = e => dbLocal = e.target.result;
}

window.saveLocal = function() {
    if (!dbLocal) return alert("Local DB not ready");
    const tx = dbLocal.transaction("offline_queue", "readwrite");
    const store = tx.objectStore("offline_queue");
    store.add(getFormData());
    alert("💾 Saved to Local Device Memory");
};

// ================= 7. BACKGROUND AUTO-SYNC =================
setInterval(async () => {
    if (navigator.onLine && dbLocal) {
        const tx = dbLocal.transaction("offline_queue", "readwrite");
        const store = tx.objectStore("offline_queue");
        const getAllReq = store.getAll();

        getAllReq.onsuccess = async () => {
            for (const item of getAllReq.result) {
                try {
                    // Note: This background sync attempts to upload data without photos 
                    // (since photos are large and usually sent via manual syncCloud)
                    await addDoc(collection(db, "field_data"), item);
                    const delTx = dbLocal.transaction("offline_queue", "readwrite");
                    delTx.objectStore("offline_queue").delete(item.id);
                    console.log("Background sync success for ID: " + item.id);
                } catch (e) {
                    console.log("Auto-sync pending...");
                }
            }
        };
    }
}, 30000); // Check every 30 seconds
