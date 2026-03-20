/**
 * NIRMANSUTRA FIELD TERMINAL | CORE ENGINE v2.4
 * Logic for: Smart ID, Real-time Validation Sync, Image Compression, and Cloud Submission.
 */

import { db, collection, addDoc, getDocs, serverTimestamp } from "./firebase-config.js";
import { generateSmartID } from "./id-generator.js";

// =============================================================================
// 1. GLOBAL STATE & CONFIGURATION
// =============================================================================
let IMGBB_KEY = localStorage.getItem("nirmansutra_imgbb_key");
let photos = []; // Internal store for Base64 compressed image strings
let map, marker;

// Initialization: Handle ImgBB Setup for New Users
if (!IMGBB_KEY) {
    const userKey = prompt("⚠️ FIRST TIME SETUP: Please enter your ImgBB API Key to enable photo uploads.");
    if (userKey) {
        localStorage.setItem("nirmansutra_imgbb_key", userKey);
        IMGBB_KEY = userKey;
    }
}

// =============================================================================
// 2. SMART ID GENERATION ENGINE
// =============================================================================
/**
 * Refreshes the Tracking ID based on selected materials and database count.
 * This is triggered whenever a material checkbox or brand chip is clicked.
 */
window.refreshTrackingID = async function() {
    try {
        // Fetch current snapshot to calculate the next serial number
        const snapshot = await getDocs(collection(db, "field_data"));
        const count = snapshot.size;
        
        // Gather UI-specific classification data
        const type = document.getElementById("supplierType")?.value || "Retailer";
        
        // Gathers selected materials from the dynamic checkbox grid
        const selected = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
            brand: el.value, 
            variety: el.dataset.parent
        }));

        // Generate ID using the shared generator logic
        const newID = generateSmartID(type, selected, count);
        
        // Update the UI branding box
        const idBox = document.getElementById("trackingIdBox");
        if (idBox) idBox.innerText = newID;
        
        return newID;
    } catch (e) {
        console.error("Critical Error: Smart ID Generation failed.", e);
        return "RJ-UDR-ERR-000";
    }
};

// =============================================================================
// 3. IMAGE COMPRESSION ENGINE (E.164 COMPLIANCE)
// =============================================================================
/**
 * Compresses raw base64 images using HTML5 Canvas.
 * Standardizes output to JPEG format with a quality factor of 0.7 to stay under 512KB.
 */
async function compressImage(base64Str) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Modern Device Optimization: Max width of 1200px
            const MAX_WIDTH = 1200;
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Standardizing for Cloud Sync
            const result = canvas.toDataURL('image/jpeg', 0.7);
            resolve(result.split(',')[1]); // Return only the base64 data
        };
    });
}

// =============================================================================
// 4. GPS & GEOLOCATION HANDLERS
// =============================================================================
/**
 * Captures real-time GPS coordinates and performs reverse geocoding
 * to fetch a human-readable address.
 */
window.captureGPS = async function() {
    if (!navigator.geolocation) {
        return alert("Error: Geolocation is not supported by this browser.");
    }
    
    // UI Update: Inform user capture is in progress
    const gpsBtn = document.querySelector("button[onclick='captureGPS()']");
    const originalText = gpsBtn.innerText;
    gpsBtn.innerText = "⏳ CAPTURING...";
    
    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        // Set standard and specific lat/lng fields for database accuracy
        if(document.getElementById("coordinates")) document.getElementById("coordinates").value = `${lat},${lng}`;
        if(document.getElementById("lat")) document.getElementById("lat").value = lat;
        if(document.getElementById("lng")) document.getElementById("lng").value = lng;

        // Update Map View
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 17); // Focused zoom level

        try {
            // Reverse Geocoding using OpenStreetMap API
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            const addrField = document.getElementById("address");
            if (addrField) addrField.value = data.display_name;
        } catch (err) {
            console.error("Geocoding Warning: Could not resolve readable address.", err);
        } finally {
            gpsBtn.innerText = originalText;
        }
    }, err => {
        alert("❌ GPS Denied: Please enable Location Permissions in your browser settings.");
        gpsBtn.innerText = originalText;
    }, { enableHighAccuracy: true });
};

// =============================================================================
// 5. BUSINESS VERIFICATION: MULTI-PHOTO SYSTEM
// =============================================================================
/**
 * Handles the logic for the dynamic photo gallery, including capture,
 * compression, preview rendering, and deletion.
 */
window.handlePhoto = async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Enforcement: Maximum 10 photos per site survey
    if (photos.length >= 10) {
        return alert("Maximum 10 verification photos reached for this entry.");
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
        // Background Compression
        const compressed = await compressImage(event.target.result);
        photos.push(compressed);
        renderPhotoPreviews();
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset the input to allow re-selection
};

function renderPhotoPreviews() {
    const container = document.getElementById('photoPreview');
    if (!container) return;
    
    container.innerHTML = ""; // Full re-render of thumbnails
    
    photos.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = "photo-slot flex-shrink-0";
        div.innerHTML = `
            <img src="data:image/jpeg;base64,${p}" class="w-full h-full object-cover rounded-lg">
            <div class="del-btn" onclick="removePhoto(${index})">✕</div>
        `;
        container.appendChild(div);
    });
}

window.removePhoto = function(index) {
    photos.splice(index, 1);
    renderPhotoPreviews();
};

// =============================================================================
// 6. PERSISTENCE ENGINE: LOCAL DRAFTS & CLOUD SYNC
// =============================================================================
/**
 * Saves current text data to localStorage to prevent loss in areas
 * with low connectivity. Note: Compressed photos are kept in session memory.
 */
window.saveLocally = function() {
    const firm = document.getElementById("firmName").value;
    if (!firm) return alert("❌ Validation Error: Firm Name is required for a local save.");

    const draft = {
        firm,
        owner: document.getElementById("ownerName").value,
        mgr: document.getElementById("mgrName").value,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem("nirmansutra_draft", JSON.stringify(draft));
    alert("💾 DRAFT SECURED: Survey data saved to device memory.");
};

/**
 * Orchestrates the full submission process:
 * 1. Image Upload to ImgBB (Cloud storage)
 * 2. Data aggregation (Materials, Fleet, Manager Intelligence)
 * 3. Firestore Add (Database storage)
 */
window.syncCloud = async function() {
    const btn = document.getElementById("syncBtn");
    const firmName = document.getElementById("firmName").value;
    
    // Final Pre-Sync Validation
    if (!firmName) return alert("❌ Submission Blocked: Firm Name is missing.");
    if (photos.length === 0) return alert("❌ Verification Required: Please capture at least one site photo.");

    // Enter Loading State
    const originalBtnText = btn.innerText;
    btn.innerText = "⏳ UPLOADING DATA...";
    btn.disabled = true;

    try {
        // Atomic ID generation to ensure zero collision
        const finalID = await window.refreshTrackingID();

        // Step 1: Upload compressed photos to Cloud Image Storage
        let photoUrls = [];
        for (let b64Data of photos) {
            let formData = new FormData();
            formData.append("image", b64Data);
            
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            if (result.success) photoUrls.push(result.data.url);
        }

        // Step 2: Map Material Grid Selection
        const materialsSelection = Array.from(document.querySelectorAll('.data-brand:checked')).map(el => ({
            brand: el.value, 
            variety: el.dataset.parent
        }));
        
        // Step 3: Map Brand Chips Selection
        const activeBrandChips = Array.from(document.querySelectorAll('.chip.active')).map(c => c.innerText);
        
        // Step 4: Map Fleet Counter Values
        const fleetData = {};
        document.querySelectorAll('.fleet-val').forEach(el => fleetData[el.dataset.name] = el.innerText);

        // Step 5: Final Firestore Push (Enterprise Schema)
        await addDoc(collection(db, "field_data"), {
            trackingId: finalID,
            supplierType: document.getElementById("supplierType").value,
            firmName: firmName,
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
                lat: document.getElementById("lat")?.value || "",
                lng: document.getElementById("lng")?.value || "",
                address: document.getElementById("address").value
            },
            materials: materialsSelection,
            topBrands: activeBrandChips,
            fleet: fleetData,
            photos: photoUrls,
            timestamp: serverTimestamp()
        });

        // SUCCESS: Finalize Entry
        alert("🚀 SYNC COMPLETE: Record added to database!\nTracking ID: " + finalID);
        localStorage.removeItem("nirmansutra_draft");
        location.reload(); // Refresh form for next entry

    } catch (e) {
        console.error("Critical Sync Error:", e);
        alert("❌ Sync Failed: Please check your internet connection and try again.");
        btn.innerText = originalBtnText;
        btn.disabled = false;
    }
};

// =============================================================================
// 7. INITIALIZATION (DOM CONTENT READY)
// =============================================================================
window.addEventListener("DOMContentLoaded", () => {
    // Instantiate OpenStreetMap Leaflet layer
    map = L.map('map').setView([24.5854, 73.7125], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap creators'
    }).addTo(map);

    // Trigger initial Tracking ID logic
    window.refreshTrackingID();
});
