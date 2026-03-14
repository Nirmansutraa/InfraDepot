/**
 * INFRA DEPOT - DATA SYNC & SUPPLIER ENGINE
 * Logic: Optimistic Cloud Sync (March 2026 Standard)
 */

const SupplierEngine = {
    // Collects all data from the UI and prepares it for Firebase
    packageData: function() {
        console.log("SupplierEngine: Packaging survey data...");

        // Gather basic info
        const surveyData = {
            metadata: {
                timestamp: new Date().toISOString(),
                staffId: localStorage.getItem('infra_session'),
                appVersion: "3.1.0-beta"
            },
            entity: {
                firmName: document.querySelector('input[placeholder*="Firm Name"]')?.value || "",
                mobile: document.querySelector('input[placeholder="+91"]')?.value || ""
            },
            location: {
                coords: document.getElementById('form_coords')?.value || "0,0",
                address: document.getElementById('form_address')?.value || ""
            },
            materials: this.getCheckedMaterials(),
            fleet: this.getFleetCounts()
        };

        return surveyData;
    },

    // Helper: Gets all checked material boxes
    getCheckedMaterials: function() {
        const checked = [];
        const items = document.querySelectorAll('.material-item input[type="checkbox"]');
        items.forEach(item => {
            if (item.checked) {
                // Find the name of the material next to the checkbox
                checked.push(item.nextElementSibling.innerText);
            }
        });
        return checked;
    },

    // Helper: Gets the numbers from the + / - counters
    getFleetCounts: function() {
        return {
            mini_truck: document.getElementById('c1')?.innerText || "0",
            dumper: document.getElementById('c2')?.innerText || "0"
        };
    },

    // The Big Sync Function
    syncToCloud: async function() {
        const data = this.packageData();
        const syncBtn = document.querySelector('.btn-green');
        
        // 1. Visual Feedback (CMO Approved)
        syncBtn.innerHTML = "🌀 SYNCING...";
        syncBtn.disabled = true;

        try {
            // 2. Firebase Firestore Logic
            // We use a collection named 'surveys'
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            // window.db was initialized in index.html
            await addDoc(collection(window.db, "surveys"), data);

            // 3. Success State
            syncBtn.innerHTML = "✅ SYNCED SUCCESS";
            syncBtn.style.background = "var(--success-neon)";
            
            setTimeout(() => {
                alert("Survey Data Uploaded to InfraDepot Cloud!");
                location.reload(); // Refresh to clear form for next survey
            }, 1000);

        } catch (error) {
            console.error("Sync Error:", error);
            
            // 4. Offline Fallback (PWA Feature)
            localStorage.setItem('pending_sync_' + Date.now(), JSON.stringify(data));
            syncBtn.innerHTML = "💾 SAVED OFFLINE";
            syncBtn.style.background = "#f1c40f"; // Yellow for warning/offline
            
            alert("Connection Weak. Data saved to device and will sync later!");
        }
    }
};
