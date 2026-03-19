import { db, collection, addDoc, getDocs, serverTimestamp } from "./firebase-config.js";
import { generateSmartID } from "./id-generator.js";

// ================= 1. CONFIG & LOCAL STORAGE =================
let IMGBB_KEY = localStorage.getItem("nirmansutra_imgbb_key");

if (!IMGBB_KEY) {
    const userKey = prompt("⚠️ FIRST TIME SETUP: Enter your ImgBB API Key.");
    if (userKey) {
        localStorage.setItem("nirmansutra_imgbb_key", userKey);
        IMGBB_KEY = userKey;
    }
}

let photos = []; 
let map, marker;

// ================= 2. SMART ID ENGINE =================
window.refreshTrackingID = async function() {
    try {
        const snapshot = await getDocs(collection(db, "field_data"));
        const count = snapshot.size;
        const type = document.getElementById("supplierType")?.value || "Retailer";
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

// ================= 3. SAVE DATA LOCALLY =================
window.saveLocally = function() {
    const firm = document.getElementById("firmName").value;
    if (!firm) return alert("❌ Please enter Firm Name before saving locally.");

    const surveyData = {
        firmName: firm,
        ownerName: document.getElementById("ownerName").value,
        ownerPhone: document.getElementById("ownerPhone").value,
        ownerWhatsapp: document.getElementById("ownerWhatsapp").value,
        coordinates: document.getElementById("coordinates").value,
        address: document.getElementById("address").value,
        fleet: Array.from(document.querySelectorAll('.fleet-val')).map(el => ({ name: el.dataset.name, val: el.innerText })),
        // Note: Photos are stored in the global 'photos' variable (Base64)
    };

    localStorage.setItem("pending_survey", JSON.stringify(surveyData));
    alert("💾 Data Saved Locally! You can now Sync to Cloud.");
};

// ================= 4. MAP, GPS & PHOTOS =================
window.addEventListener("DOMContentLoaded", () => {
    window.refreshTrackingID();
    initMap();
});

function initMap() {
    map = L.map('map').setView([24.5854, 73.7125], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

window.captureGPS = async function() {
    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude; const lng = pos.coords.longitude;
        document.getElementById("coordinates").value = lat + "," + lng;
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 16);
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        document.getElementById("address").value = data.display_name;
    });
};

window.handlePhoto = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        photos.push(event.target.result.split(',')[1]); 
        const img = document.createElement('img');
        img.src = event.target.result;
        img.className = "w-16 h-16 rounded object-cover border-2 border-orange-500";
        document.getElementById('photoPreview').appendChild(img);
    };
    reader.readAsDataURL(file);
};

// ================= 5. CLOUD SYNC & AUTO-CLEAR =================
window.syncCloud = async function() {
    const btn = document.getElementById("syncBtn");
    const firm = document.getElementById("firmName").value;
    
    if (!firm) return alert("❌ Firm Name Required!");
    if (photos.length === 0) return alert("❌ At least one photo is required!");

    btn.innerText = "⌛ SYNCING..."; btn.disabled = true;

    try {
        const finalID = await window.refreshTrackingID();

        // 1. Upload Photos
        let photoUrls = [];
        for (let base64Image of photos) {
            let formData = new FormData();
            formData.append("image", base64Image);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            if (result.success) photoUrls.push(result.data.url);
        }

        // 2. Gather Data
        const materials = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
            brand: el.value, variety: el.dataset.parent
        }));
        
        const fleet = {};
        document.querySelectorAll('.fleet-val').forEach(el => fleet[el.dataset.name] = el.innerText);

        // 3. Save to Firestore
        await addDoc(collection(db, "field_data"), {
            trackingId: finalID,
            supplierType: document.getElementById("supplierType").value,
            firmName: firm,
            owner: {
                name: document.getElementById("ownerName").value,
                phone: document.getElementById("ownerPhone").value,
                whatsapp: document.getElementById("ownerWhatsapp").value
            },
            location: {
                coords: document.getElementById("coordinates").value,
                address: document.getElementById("address").value
            },
            materials,
            fleet,
            photos: photoUrls,
            timestamp: serverTimestamp()
        });

        // ✅ SUCCESS ACTIONS
        alert("🚀 CLOUD SYNC SUCCESSFUL!\nTracking ID: " + finalID + "\nForm cleared for next entry.");
        
        // Clear Local Storage and Refresh Page to reset form
        localStorage.removeItem("pending_survey");
        location.reload(); 

    } catch (e) {
        console.error("Sync Error:", e);
        alert("❌ Sync Failed! Data is still saved locally. Check internet.");
        btn.innerText = "🚀 SYNC TO CLOUD"; btn.disabled = false;
    }
};
