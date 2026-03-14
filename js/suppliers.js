/**
 * INFRA DEPOT - CLOUD SYNC ENGINE
 * March 2026 Edition
 */

const SupplierEngine = {
    // Collect data from the 2026 Modern UI
    packageData: function() {
        return {
            timestamp: new Date().toISOString(),
            staffId: localStorage.getItem('infra_session') || "Unknown",
            firmName: document.querySelector('input[placeholder*="Firm Name"]')?.value || "N/A",
            location: {
                coords: document.getElementById('form_coords')?.value || "Pending",
                address: document.getElementById('form_address')?.value || "Pending"
            },
            fleet: {
                mini_truck: document.getElementById('c1')?.innerText || "0",
                dumper: document.getElementById('c2')?.innerText || "0"
            }
        };
    },

    // Send to Firebase Firestore
    syncToCloud: async function() {
        const data = this.packageData();
        const syncBtn = document.querySelector('.btn-green');
        
        syncBtn.innerHTML = "🌀 SYNCING...";
        syncBtn.disabled = true;

        try {
            // Import the specific function from the web
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            // window.db was created in index.html
            await addDoc(collection(window.db, "surveys"), data);

            syncBtn.innerHTML = "✅ SYNCED SUCCESS";
            syncBtn.style.background = "#2dd4bf";
            
            setTimeout(() => {
                alert("Survey Data Uploaded to Cloud!");
                location.reload(); 
            }, 1000);

        } catch (error) {
            console.error("Cloud Error:", error);
            syncBtn.innerHTML = "💾 SAVED OFFLINE";
            syncBtn.disabled = false;
            // Save to local device memory if cloud fails
            localStorage.setItem('backup_survey_' + Date.now(), JSON.stringify(data));
        }
    }
};
