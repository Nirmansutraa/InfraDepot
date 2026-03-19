import { db, collection, addDoc, getDocs, serverTimestamp } from "./firebase-config.js";
import { generateSmartID } from "./id-generator.js";

// ================= 1. SECURITY VAULT =================
let IMGBB_KEY = localStorage.getItem("nirmansutra_imgbb_key");

if (!IMGBB_KEY) {
    const userKey = prompt("⚠️ FIRST TIME SETUP: Enter your ImgBB API Key to enable photos.");
    if (userKey) {
        localStorage.setItem("nirmansutra_imgbb_key", userKey);
        IMGBB_KEY = userKey;
    }
}

// ================= 2. STATE & TRACKING ID =================
let photos = []; 
let map, marker;

// Function to calculate and update the ID on the screen
window.refreshTrackingID = async function() {
    try {
        // Fetch current count from Firebase
        const snapshot = await getDocs(collection(db, "field_data"));
        const count = snapshot.size;

        // Get current form values
        const supplierType = document.getElementById("supplierType")?.value || "Retailer";
        const selectedMaterials = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
            brand: el.value, 
            variety: el.dataset.parent
        }));

        // Use the exclusive logic file
        const newID = generateSmartID(supplierType, selectedMaterials, count);
        
        document.getElementById("trackingIdBox").innerText = newID;
        return newID;
    } catch (e) {
        console.error("ID Refresh Failed:", e);
        return "ID-ERROR";
    }
};

// ================= 3. INIT & MAP =================
window.addEventListener("DOMContentLoaded", () => {
    window.refreshTrackingID(); // Generate initial ID
    initMap();

    // Listen for changes in Type or Materials to update ID live
    document.addEventListener("change", (e) => {
        if (e.target.id === "supplierType" || e.target.classList.contains('data-brand')) {
            window.refreshTrackingID();
        }
    });
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
        photos.push(event.target.result.split(',')[1]); 
        const img = document.createElement('img');
        img.src = event.target.result;
        img.className = "w-16 h-16 rounded object-cover border-2 border-orange-500";
        document.getElementById('photoPreview').appendChild(img);
    };
    reader.readAsDataURL(file);
};

// ================= 5. THE CLEAN SYNC =================
window.syncCloud = async function() {
    const btn = document.getElementById("syncBtn");
    const firm = document.getElementById("firmName").value;
    
    if (!firm) return alert("Firm Name Required!");
    if (!IMGBB_KEY) return alert("API Key Missing. Refresh page.");

    btn.innerText = "⌛ UPLOADING..."; btn.disabled = true;

    try {
        // STEP A: Final ID Refresh to ensure serial is correct
        const finalID = await window.refreshTrackingID();

        // STEP B: Upload to ImgBB
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

        // STEP C: Scrape Form Data
        const materials = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
            brand: el.value, variety: el.dataset.parent
        }));
        
        const fleet = {};
        document.querySelectorAll('.fleet-val').forEach(el => fleet[el.dataset.name] = el.innerText);

        // STEP D: Save to Firestore
        await addDoc(collection(db, "field_data"), {
            trackingId: finalID,
            firmName: firm,
            supplierType: document.getElementById("supplierType")?.value || "Retailer",
            owner: document.getElementById("ownerName").value,
            phone: document.getElementById("ownerPhone").value,
            address: document.getElementById("address").value,
            gps: document.getElementById("coordinates").value,
            materials,
            fleet,
            photos: photoUrls,
            timestamp: serverTimestamp()
        });

        alert("🚀 SUCCESS: Survey Synced with ID: " + finalID);
        location.reload();

    } catch (e) {
        console.error("Sync Error:", e);
        alert("❌ Sync Failed. Check console.");
        btn.innerText = "🚀 SUBMIT SYNC"; btn.disabled = false;
    }
};
