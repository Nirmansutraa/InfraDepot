/**
 * INFRA DEPOT - CLOUD SYNC ENGINE
 * March 2026 Production Edition
 */
console.log("✅ SupplierEngine: Script Loaded and Ready.");

const SupplierEngine = {
    packageData: function() {
        return {
            timestamp: new Date().toISOString(),
            staffId: localStorage.getItem('infra_session') || "GUEST",
            firmName: document.querySelector('input[placeholder*="Firm Name"]')?.value || "Unnamed",
            location: {
                coords: document.getElementById('form_coords')?.value || "0,0",
                address: document.getElementById('form_address')?.value || ""
            },
            fleet: {
                mini_truck: document.getElementById('c1')?.innerText || "0",
                dumper: document.getElementById('c2')?.innerText || "0"
            }
        };
    },

    syncToCloud: async function() {
        console.log("Button Pressed: Attempting Cloud Sync...");
        const syncBtn = document.getElementById('sync_btn');
        
        if (syncBtn) {
            syncBtn.innerHTML = "🌀 SYNCING...";
            syncBtn.disabled = true;
        }

        try {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            const data = this.packageData();
            await addDoc(collection(window.db, "surveys"), data);
            
            console.log("Cloud Upload Successful!");
            alert("SUCCESS! Survey saved to Cloud.");
            location.reload();

        } catch (error) {
            console.error("Cloud Error:", error);
            alert("Cloud Error: " + error.message);
            if (syncBtn) {
                syncBtn.innerHTML = "🚀 RETRY";
                syncBtn.disabled = false;
            }
        }
    }
};

// This line allows the HTML button to find the function
window.SupplierEngine = SupplierEngine;
