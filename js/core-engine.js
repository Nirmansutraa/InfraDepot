import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

// ================= 1. SECURITY VAULT =================
let IMGBB_KEY = localStorage.getItem("nirmansutra_imgbb_key");

if (!IMGBB_KEY) {
    const userKey = prompt("⚠️ FIRST TIME SETUP: Enter your ImgBB API Key to enable photos.");
    if (userKey) {
        localStorage.setItem("nirmansutra_imgbb_key", userKey);
        IMGBB_KEY = userKey;
    }
}

// ================= 2. STATE =================
let photos = []; 
let trackingId = "ID-" + Date.now();
let map, marker;

// ================= 3. INIT & MAP =================
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("trackingIdBox").innerText = trackingId;
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

// ================= 4. PHOTO HANDLING =================
window.handlePhoto = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        // We store the Base64 string for ImgBB
        photos.push(event.target.result.split(',')[1]); 
        const img = document.createElement('img');
        img.src = event.target.result;
        img.className = "w-16 h-16 rounded object-cover border-2 border-orange-500";
        document.getElementById('photoPreview').appendChild(img);
    };
    reader.readAsDataURL(file);
};

// ================= 5. THE CLEAN SYNC (IMGBB ONLY) =================
window.syncCloud = async function() {
    const btn = document.getElementById("syncBtn");
    const firm = document.getElementById("firmName").value;
    
    if (!firm) return alert("Firm Name Required!");
    if (!IMGBB_KEY) return alert("API Key Missing. Refresh page.");

    btn.innerText = "⌛ UPLOADING..."; btn.disabled = true;

    try {
        // STEP A: Upload to ImgBB (Bypasses Firebase Storage)
        let photoUrls = [];
        for (let base64Image of photos) {
            let formData = new FormData();
            formData.append("image", base64Image);
            
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                photoUrls.push(result.data.url);
            } else {
                console.error("ImgBB Error:", result);
            }
        }

        // STEP B: Scrape Text Data
        const materials = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
            brand: el.value, variety: el.dataset.parent
        }));
        
        const fleet = {};
        document.querySelectorAll('.fleet-val').forEach(el => fleet[el.dataset.name] = el.innerText);

        // STEP C: Save to Firestore (This is allowed on Spark Plan)
        await addDoc(collection(db, "field_data"), {
            trackingId,
            firmName: firm,
            owner: document.getElementById("ownerName").value,
            phone: document.getElementById("ownerPhone").value,
            address: document.getElementById("address").value,
            gps: document.getElementById("coordinates").value,
            materials,
            fleet,
            photos: photoUrls, // ImgBB links saved here
            timestamp: serverTimestamp()
        });

        alert("🚀 SUCCESS: Survey Synced!");
        location.reload();

    } catch (e) {
        console.error("Sync Error:", e);
        alert("❌ Sync Failed. Check console for details.");
        btn.innerText = "🚀 SUBMIT SYNC"; btn.disabled = false;
    }
};
