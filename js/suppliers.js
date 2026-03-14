/**
 * INFRA DEPOT - CLOUD & HISTORY ENGINE
 */

const SupplierEngine = {
    packageData: function() {
        return {
            timestamp: new Date().toISOString(),
            staffId: localStorage.getItem('infra_session') || "FS-001",
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
        const syncBtn = document.getElementById('sync_btn');
        if (syncBtn) { syncBtn.innerHTML = "🌀 SYNCING..."; syncBtn.disabled = true; }

        try {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const data = this.packageData();
            await addDoc(collection(window.db, "surveys"), data);
            
            alert("SUCCESS! Survey saved to Cloud.");
            this.loadHistory(); // Refresh the list after saving
            location.reload();
        } catch (error) {
            alert("Cloud Error: " + error.message);
            if (syncBtn) { syncBtn.innerHTML = "🚀 RETRY"; syncBtn.disabled = false; }
        }
    },

    // NEW: Function to pull data back from Firebase
    loadHistory: async function() {
        const historyBox = document.getElementById('history_list');
        if (!historyBox) return;

        try {
            const { collection, query, orderBy, limit, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            const q = query(collection(window.db, "surveys"), orderBy("timestamp", "desc"), limit(3));
            const querySnapshot = await getDocs(q);
            
            let html = "";
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                html += `
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-bottom:8px; border-left:4px solid var(--accent-glow);">
                        <div style="font-size:12px; color:var(--accent-glow)">${item.timestamp.split('T')[0]}</div>
                        <div style="font-weight:bold;">${item.firmName}</div>
                        <div style="font-size:11px; color:#aaa;">🚚 ${item.fleet.mini_truck} Mini | 🚛 ${item.fleet.dumper} Dumper</div>
                    </div>
                `;
            });
            historyBox.innerHTML = html || "No recent surveys found.";
        } catch (e) {
            console.error("History Load Error:", e);
        }
    }
};

window.SupplierEngine = SupplierEngine;
