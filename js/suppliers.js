/**
 * INFRA DEPOT - CLOUD SYNC ENGINE
 * Fix: Global Availability & Test Mode Logic
 */

const SupplierEngine = {
    // Collect data from the UI
    packageData: function() {
        return {
            timestamp: new Date().toISOString(),
            staffId: localStorage.getItem('infra_session') || "GUEST",
            firmName: document.querySelector('input[placeholder*="Firm Name"]')?.value || "Unnamed Firm",
            mobile: document.querySelector('input[placeholder="+91"]')?.value || "No Mobile",
            location: {
                coords: document.getElementById('form_coords')?.value || "0,0",
                address: document.getElementById('form_address')?.value || "No Address"
            },
            fleet: {
                mini_truck: document.getElementById('c1')?.innerText || "0",
                dumper: document.getElementById('c2')?.innerText || "0"
            }
        };
    },

    // Send to Firebase
    syncToCloud: async function() {
        console.log("Sync initiated...");
        const syncBtn = document.getElementById('sync_btn');
        
        if (syncBtn) {
            syncBtn.innerHTML = "🌀 CONNECTING...";
            syncBtn.disabled = true;
        }

        try {
            // 1. Check if Firebase is ready
            if (!window.db) {
                throw new Error("Cloud connection not established. Check index.html keys.");
            }

            // 2. Load Firestore library
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            // 3. Prepare Data
            const data = this.packageData();

            // 4. Submit to 'surveys' collection
            const docRef = await addDoc(collection(window.db, "surveys"), data);
            
            console.log("Success! ID:", docRef.id);

            if (syncBtn) {
                syncBtn.innerHTML = "✅ SYNCED SUCCESS";
                syncBtn.style.background = "#2dd4bf";
            }

            setTimeout(() => {
                alert("Cloud Sync Successful!");
                location.reload(); 
            }, 1000);

        } catch (error) {
            console.error("Sync Error:", error);
            alert("Sync Failed: " + error.message);
            
            if (syncBtn) {
                syncBtn.innerHTML = "🚀 RETRY SYNC";
                syncBtn.disabled = false;
            }
        }
    }
};

// CRITICAL: This makes the button able to find the code
window.SupplierEngine = SupplierEngine;
