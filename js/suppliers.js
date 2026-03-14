/**
 * INFRA DEPOT - CLOUD SYNC ENGINE
 * Production Fix: March 2026
 */

const SupplierEngine = {
    // Safely collect data from the UI
    packageData: function() {
        console.log("Packaging data for Cloud...");
        
        // We use querySelector to find the inputs by their labels/placeholders
        return {
            timestamp: new Date().toISOString(),
            staffId: localStorage.getItem('infra_session') || "FS-UNKNOWN",
            firmName: document.querySelector('input[placeholder*="Firm Name"]')?.value || "Unnamed Firm",
            mobile: document.querySelector('input[placeholder="+91"]')?.value || "0000000000",
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

    // The function called by the button
    syncToCloud: async function() {
        console.log("Sync process started...");
        
        const syncBtn = document.getElementById('sync_btn');
        if (syncBtn) {
            syncBtn.innerHTML = "🌀 CONNECTING...";
            syncBtn.disabled = true;
        }

        try {
            // Check if Firebase Database is ready
            if (!window.db) {
                throw new Error("Firebase Database (window.db) not found. Check index.html");
            }

            // Import the 'addDoc' function from Firebase
            const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            const data = this.packageData();
            data.createdAt = serverTimestamp(); // Add official server time

            // Send to 'surveys' collection
            const docRef = await addDoc(collection(window.db, "surveys"), data);
            
            console.log("Cloud Success! ID:", docRef.id);
            
            if (syncBtn) {
                syncBtn.innerHTML = "✅ SYNCED";
                syncBtn.style.background = "#2dd4bf";
            }

            setTimeout(() => {
                alert("Data successfully sent to InfraDepot Cloud!");
                location.reload(); 
            }, 1000);

        } catch (error) {
            console.error("Critical Sync Error:", error);
            alert("Sync Failed: " + error.message);
            
            if (syncBtn) {
                syncBtn.innerHTML = "🚀 RETRY SYNC";
                syncBtn.disabled = false;
            }
        }
    }
};

// Make it global so the button can see it
window.SupplierEngine = SupplierEngine;
