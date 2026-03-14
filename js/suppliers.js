/**
 * INFRA DEPOT - ANALYTICS & ADVANCED SYNC
 */

const SupplierEngine = {
    loadDashboardStats: async function() {
        try {
            const { collection, getDocs, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const q = query(collection(window.db, "surveys"));
            const snap = await getDocs(q);
            
            let stats = { today: 0, week: 0, month: 0, year: 0 };
            const now = new Date();

            snap.forEach(doc => {
                const data = doc.data();
                const d = new Date(data.timestamp);
                
                if (d.toDateString() === now.toDateString()) stats.today++;
                if (now - d < 7 * 24 * 60 * 60 * 1000) stats.week++;
                if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) stats.month++;
                if (d.getFullYear() === now.getFullYear()) stats.year++;
            });

            document.getElementById('stat_today').innerText = stats.today;
            document.getElementById('stat_week').innerText = stats.week;
            document.getElementById('stat_month').innerText = stats.month;
            document.getElementById('stat_year').innerText = stats.year;
        } catch (e) { console.error("Stats Error:", e); }
    },

    syncToCloud: async function() {
        const syncBtn = document.getElementById('sync_btn');
        syncBtn.innerHTML = "🌀 UPLOADING PHOTOS & DATA...";
        syncBtn.disabled = true;

        try {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            const payload = {
                timestamp: new Date().toISOString(),
                firmName: document.getElementById('f_name').value,
                owner: {
                    name: document.getElementById('o_name').value,
                    mob: document.getElementById('o_mob').value,
                    wa: document.getElementById('o_wa').value
                },
                manager: {
                    mob: document.getElementById('m_mob').value,
                    wa: document.getElementById('m_wa').value
                },
                location: {
                    address: document.getElementById('form_address').value,
                    isFullUdaipur: document.getElementById('area_full').checked,
                    is25kmRadius: document.getElementById('area_radius').checked
                },
                fleet: {
                    tractor: document.getElementById('fl_trac').innerText,
                    mini_truck: document.getElementById('fl_mini').innerText,
                    truck: document.getElementById('fl_truck').innerText,
                    dumper: document.getElementById('fl_dump').innerText,
                    trailer: document.getElementById('fl_trail').innerText
                },
                photos: UIEngine.photos // Base64 encoded images
            };

            await addDoc(collection(window.db, "surveys"), payload);
            alert("MIS DATA SYNCED SUCCESSFULLY!");
            location.reload();
        } catch (error) {
            alert("Error: " + error.message);
            syncBtn.disabled = false;
        }
    }
};
window.SupplierEngine = SupplierEngine;
