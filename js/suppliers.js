/**
 * INFRA DEPOT - CLOUD SYNC ENGINE
 * March 2026 Production Fix
 */

const SupplierEngine = {
    packageData: function() {
        console.log("Packaging data...");
        return {
            timestamp: new Date().toISOString(),
            staffId: localStorage.getItem('infra_session') || "GUEST_USER",
            firmName: document.querySelector('input[placeholder*="Enter Firm Name"]')?.value || "Unnamed Firm",
            ownerMobile: document.querySelector('input[placeholder="+91"]')?.value || "No Phone",
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

    syncToCloud: async function() {
        console.log("Sync button clicked!"); // This checks if the link works
        
        const syncBtn = document.querySelector('.btn-green');
        const data = this.packageData();
        
        syncBtn.innerHTML = "🌀 CONNECTING...";
        syncBtn.disabled = true;

        try {
            // Import Firestore dynamically
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            // window.db is the global Firebase connection from index.html
            if (!window.db) {
                throw new Error("Firebase not initialized. Check index.html keys.");
            }

            const docRef = await addDoc(collection(window.db, "surveys"), data);
            console.log("Document written with ID: ", docRef.id);

            syncBtn.innerHTML = "✅ SUCCESS";
            syncBtn.style.background = "#2dd4bf";
            
            setTimeout(() => {
                alert("Survey Sent to Cloud!");
                location.reload(); 
            }, 1000);

        } catch (error) {
            console.error("Cloud Sync Failed:", error);
            syncBtn.innerHTML = "💾 SAVED LOCALLY";
            syncBtn.disabled = false;
            localStorage.setItem('cached_survey_' + Date.now(), JSON.stringify(data));
            alert("Sync Failed: " + error.message);
        }
    }
};

// CRITICAL: Make the engine global so the HTML button can "see" it
window.SupplierEngine = SupplierEngine;
