/**
 * INFRA DEPOT - STORAGE ENGINE
 */
const StorageEngine = {
    syncToCloud: async function() {
        console.log("Storage: Syncing survey...");
        
        const nameInput = document.getElementById('firm_name');
        const latInput = document.getElementById('survey_lat');
        const lngInput = document.getElementById('survey_lng');

        const name = nameInput ? nameInput.value.trim() : "";
        const lat = latInput ? latInput.value : "";
        const lng = lngInput ? lngInput.value : "";

        if (!name || !lat || !lng) {
            return alert("Please enter Firm Name and Capture GPS first!");
        }

        try {
            // Load Firestore dynamically
            const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            const userStr = localStorage.getItem('infra_user');
            const user = userStr ? JSON.parse(userStr) : { id: "unknown" };

            await addDoc(collection(window.db, "surveys"), {
                firmName: name,
                location: { lat: parseFloat(lat), lng: parseFloat(lng) },
                timestamp: serverTimestamp(),
                staffId: user.id
            });

            alert("✅ Survey Synced Successfully!");
            location.reload(); 
        } catch (e) {
            console.error("Sync Error:", e);
            alert("Failed to sync. Check your internet connection.");
        }
    }
};

// Push to global window so the HTML button can find it
window.StorageEngine = StorageEngine;
console.log("Storage: Engine Registered.");
