/**
 * INFRA DEPOT - STORAGE ENGINE
 */
export const StorageEngine = {
    syncToCloud: async function() {
        console.log("Storage: Syncing survey to cloud...");
        
        const name = document.getElementById('firm_name')?.value;
        const lat = document.getElementById('survey_lat')?.value;
        const lng = document.getElementById('survey_lng')?.value;

        if (!name || !lat || !lng) {
            return alert("Please fill all fields and capture GPS!");
        }

        try {
            const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            await addDoc(collection(window.db, "surveys"), {
                firmName: name,
                location: { lat: parseFloat(lat), lng: parseFloat(lng) },
                timestamp: serverTimestamp(),
                staffId: JSON.parse(localStorage.getItem('infra_user')).id
            });

            alert("✅ Survey Synced Successfully!");
            location.reload(); // Clear form
        } catch (e) {
            console.error(e);
            alert("Error syncing data.");
        }
    }
};

// CRITICAL: Make it globally accessible
window.StorageEngine = StorageEngine;
