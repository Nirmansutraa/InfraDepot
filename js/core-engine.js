import { db, collection, addDoc, getDocs, serverTimestamp } from "./firebase-config.js";
import { generateSmartID } from "./id-generator.js";

// ================= 1. STATE & CONFIG =================
let IMGBB_KEY = localStorage.getItem("nirmansutra_imgbb_key");
if (!IMGBB_KEY) {
    const userKey = prompt("⚠️ FIRST TIME SETUP: Enter your ImgBB API Key.");
    if (userKey) {
        localStorage.setItem("nirmansutra_imgbb_key", userKey);
        IMGBB_KEY = userKey;
    }
}

let photos = []; // Stores Base64 strings of compressed images
let map, marker;

// ================= 2. AUTO-FILL & SYNC LOGIC (NEW) =================
window.validatePhone = function(el) {
    el.value = el.value.replace(/\D/g, '').slice(0, 10);
};

window.syncPhoneToWhatsapp = function() {
    const phone = document.getElementById('ownerPhone').value;
    const isChecked = document.getElementById('syncWhatsapp').checked;
    if(isChecked) document.getElementById('ownerWhatsapp').value = phone;
};

window.syncMgrToWhatsapp = function() {
    const phone = document.getElementById('mgrPhone').value;
    const isChecked = document.getElementById('syncMgrWhatsapp').checked;
    if(isChecked) document.getElementById('mgrWhatsapp').value = phone;
};

// ================= 3. IMAGE COMPRESSION (MAX 512KB) =================
async function compressImage(base64Str) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 1000;
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to 0.7 quality to stay under 512KB
            resolve(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]);
        };
    });
}

// ================= 4. SMART ID ENGINE =================
window.refreshTrackingID = async function() {
    try {
        const snapshot = await getDocs(collection(db, "field_data"));
        const count = snapshot.size;
        const type = document.getElementById("supplierType")?.value || "Retailer";
        
        // Get selected materials from brand checkboxes
        const selected = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
            brand: el.value, 
            variety: el.dataset.parent
        }));

        const newID = generateSmartID(type, selected, count);
        document.getElementById("trackingIdBox").innerText = newID;
        return newID;
    } catch (e) {
        console.error("ID Generation Error:", e);
        return "RJ-UDR-ERR-000";
    }
};

// ================= 5. GPS & PHOTO HANDLERS =================
window.captureGPS = async function() {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    
    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        document.getElementById("coordinates").value = `${lat},${lng}`;
        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;

        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 16);

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            document.getElementById("address").value = data.display_name;
        } catch (err) {
            console.error("Reverse Geocode Failed", err);
        }
    }, err => alert("Please enable GPS Access"), { enableHighAccuracy: true });
};

window.handlePhoto = async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (photos.length >= 10) return alert("Max 10 photos allowed");

    const reader = new FileReader();
    reader.onload = async (event) => {
        const compressed = await compressImage(event.target.result);
        photos.push(compressed);
        renderPhotoPreviews();
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset input
};

function renderPhotoPreviews() {
    const container = document.getElementById('photoPreview');
    container.innerHTML = "";
    photos.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = "photo-slot flex-shrink-0";
        div.innerHTML = `
            <img src="data:image/jpeg;base64,${p}" class="w-full h-full object-cover">
            <div class="del-btn" onclick="removePhoto(${index})">✕</div>
        `;
        container.appendChild(div);
    });
}

window.removePhoto = function(index) {
    photos.splice(index, 1);
    renderPhotoPreviews();
};

// ================= 6. PERSISTENCE (LOCAL & CLOUD) =================
window.saveLocally = function() {
    const firm = document.getElementById("firmName").value;
    if (!firm) return alert("❌ Firm Name Required for local save.");

    const draft = {
        firm,
        owner: document.getElementById("ownerName").value,
        phone: document.getElementById("ownerPhone").value,
        mgrName: document.getElementById("mgrName").value,
        timestamp: Date.now()
    };
    localStorage.setItem("nirmansutra_draft", JSON.stringify(draft));
    alert("💾 Saved to device memory!");
};

window.syncCloud = async function() {
    const btn = document.getElementById("syncBtn");
    const firm = document.getElementById("firmName").value;
    
    if (!firm) return alert("❌ Firm Name Required!");
    if (photos.length === 0) return alert("❌ Photo verification required!");

    btn.innerText = "⌛ UPLOADING..."; btn.disabled = true;

    try {
        const finalID = await window.refreshTrackingID();

        // 1. Upload compressed photos to ImgBB
        let photoUrls = [];
        for (let b64 of photos) {
            let formData = new FormData();
            formData.append("image", b64);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            if (result.success) photoUrls.push(result.data.url);
        }

        // 2. Map Material Selection
        const materials = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
            brand: el.value, variety: el.dataset.parent
        }));
        
        // 3. Collect Fleet Data
        const fleet = {};
        document.querySelectorAll('.fleet-val').forEach(el => fleet[el.dataset.name] = el.innerText);

        // 4. Collect Top Brands Selection
        const selectedTopBrands = Array.from(document.querySelectorAll('.chip.active')).map(c => c.innerText);

        // 5. Final Save to Firestore
        await addDoc(collection(db, "field_data"), {
            trackingId: finalID,
            supplierType: document.getElementById("supplierType").value,
            firmName: firm,
            owner: {
                name: document.getElementById("ownerName").value,
                phone: document.getElementById("ownerPhone").value,
                whatsapp: document.getElementById("ownerWhatsapp").value
            },
            manager: {
                name: document.getElementById("mgrName").value,
                phone: document.getElementById("mgrPhone").value,
                whatsapp: document.getElementById("mgrWhatsapp").value
            },
            location: {
                coords: document.getElementById("coordinates").value,
                lat: document.getElementById("lat").value,
                lng: document.getElementById("lng").value,
                address: document.getElementById("address").value
            },
            materials,
            fleet,
            topBrands: selectedTopBrands,
            photos: photoUrls,
            timestamp: serverTimestamp()
        });

        alert("🚀 CLOUD SYNC SUCCESS!\nID: " + finalID);
        localStorage.removeItem("nirmansutra_draft");
        location.reload(); 

    } catch (e) {
        console.error("Sync Error:", e);
        alert("❌ Sync Failed. Check internet connection.");
        btn.innerText = "🚀 SYNC TO CLOUD"; btn.disabled = false;
    }
};

// ================= 7. INITIALIZATION =================
window.addEventListener("DOMContentLoaded", () => {
    map = L.map('map').setView([24.5854, 73.7125], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    window.refreshTrackingID();
});
