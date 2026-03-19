// ================= IMPORTS =================
import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

// ================= SECURITY VAULT (GitHub Safe) =================
let IMGBB_KEY = localStorage.getItem("nirmansutra_imgbb_key");

if (!IMGBB_KEY) {
    const userKey = prompt("⚠️ FIRST TIME SETUP: Enter your ImgBB API Key to enable photos. (This stays private on this device)");
    if (userKey) {
        localStorage.setItem("nirmansutra_imgbb_key", userKey);
        IMGBB_KEY = userKey;
    }
}

// ================= GLOBAL STATE =================
let photos = [];
let trackingId = "";
let map, marker;
let dbLocal;

// ================= 1. INITIALIZATION =================
window.addEventListener("DOMContentLoaded", () => {
    trackingId = "ID-" + Date.now();
    const idBox = document.getElementById("trackingIdBox");
    if(idBox) idBox.innerText = trackingId;

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

// ================= 2. MAP =================
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || map) return;

    map = L.map('map').setView([24.5854, 73.7125], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
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

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            document.getElementById("address").value = data.display_name || "Address found";
        } catch (err) {
            console.error("Address fetch failed", err);
        }
    }, err => alert("GPS Error: " + err.message));
};

// ================= 3. IMAGE HANDLING & WATERMARK =================
window.handlePhoto = function(e) {
    if (photos.length >= 10) return alert("Max 10 photos allowed");

    const file = e.target.files[0];
    if (!file) return;

    processImage(file).then(base64Data => {
        photos.push({
            imgData: base64Data, // This is the final watermarked string
            time: new Date().toISOString(),
            gps: document.getElementById("coordinates").value
        });
        renderPhotos();
    });
};

function processImage(file) {
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

                // Watermark logic
                ctx.fillStyle = "yellow";
                ctx.font = "bold 18px Arial";
                const stamp = new Date().toLocaleString() + " | " + document.getElementById("coordinates").value;
                
                // Shadow for visibility
                ctx.shadowColor = "black";
                ctx.shadowBlur = 5;
                ctx.fillText(stamp, 20, canvas.height - 20);

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
        img.src = p.imgData;
        img.className = "w-16 h-16 rounded object-cover border border-orange-400";
        div.appendChild(img);
    });
}

// ================= 4. DATA COLLECTION =================
function getFormData() {
    const selectedMaterials = Array.from(document.querySelectorAll('.data-brand:checked'))
        .map(el => ({
            brand: el.value,
            variety: el.dataset.parent
        }));

    const fleetData = {};
    document.querySelectorAll('.fleet-val').forEach(el => {
        fleetData[el.dataset.name] = parseInt(el.innerText) || 0;
    });

    return {
        trackingId: trackingId,
        firmName: document.getElementById("firmName").value,
        owner: {
            name: document.getElementById("ownerName").value,
            phone: document.getElementById("ownerPhone").value,
            whatsapp: document.getElementById("ownerWhatsapp").value
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

// ================= 5. CLOUD SYNC (HYBRID) =================
window.syncCloud = async function() {
    const btn = document.getElementById("syncBtn");
    if (!document.getElementById("firmName").value) return alert("Firm Name Required");
    if (!IMGBB_KEY) return alert("API Key Missing. Refresh page.");

    try {
        btn.innerText = "⌛ SYNCING...";
        btn.disabled = true;

        const data = getFormData();
        
        // --- STEP A: UPLOAD TO IMGBB ---
        let photoUrls = [];
        for (let p of photos) {
            let formData = new FormData();
            // Convert base64 back to file-like string for ImgBB
            formData.append("image", p.imgData.split(',')[1]);
            
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            if (result.success) photoUrls.push(result.data.url);
        }
        data.photos = photoUrls;

        // --- STEP B: SAVE TO FIRESTORE ---
        await addDoc(collection(db, "field_data"), data);

        alert("🚀 Cloud Sync Successful!");
        location.reload();

    } catch (err) {
        console.error(err);
        alert("❌ Sync Failed. Saved locally");
        saveLocal();
        btn.innerText = "🚀 SUBMIT SYNC";
        btn.disabled = false;
    }
};

// ================= 6. INDEXED DB & AUTO-SYNC =================
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
    store.add({ ...getFormData(), photos: photos });
    alert("💾 Saved Offline");
};

setInterval(async () => {
    if (navigator.onLine && dbLocal) {
        const tx = dbLocal.transaction("offline_queue", "readwrite");
        const store = tx.objectStore("offline_queue");
        const getAllReq = store.getAll();

        getAllReq.onsuccess = async () => {
            for (const item of getAllReq.result) {
                try {
                    // Note: Background sync for hybrid would need ImgBB logic 
                    // To keep it simple, we just try to push data to Firebase
                    await addDoc(collection(db, "field_data"), item);
                    const delTx = dbLocal.transaction("offline_queue", "readwrite");
                    delTx.objectStore("offline_queue").delete(item.id);
                } catch (e) { console.log("Pending..."); }
            }
        };
    }
}, 30000);
