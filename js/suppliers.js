/**
 * INFRA DEPOT - ENTERPRISE SYNC ENGINE (FIXED)
 */

const SupplierEngine = {
    loadDashboardStats: async function() {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.db, "surveys"));
            const count = snap.size;
            document.getElementById('stat_today').innerText = count;
            document.getElementById('stat_week').innerText = count;
            document.getElementById('stat_month').innerText = count;
            document.getElementById('stat_year').innerText = count;
        } catch (e) { console.warn("Dashboard stats update."); }
    },

    syncToCloud: async function() {
        const syncBtn = document.getElementById('sync_btn');
        if (syncBtn) {
            syncBtn.innerHTML = "🌀 SYNCING DATA...";
            syncBtn.disabled = true;
        }

        try {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            // Gather Materials
            const mats = {};
            document.querySelectorAll('.mat-main-check:checked').forEach(m => {
                const name = m.value;
                mats[name] = { 
                    varieties: Array.from(document.querySelectorAll(`.v-check[data-mat="${name}"]:checked`)).map(el => el.value),
                    brands: Array.from(document.querySelectorAll(`.b-check[data-mat="${name}"]:checked`)).map(el => el.value)
                };
            });

            const payload = {
                timestamp: new Date().toISOString(),
                business: {
                    firm: document.getElementById('f_name').value,
                    owner: document.getElementById('o_name').value,
                    ownerMob: document.getElementById('o_mob').value,
                    ownerWA: document.getElementById('o_wa').value,
                    managerMob: document.getElementById('m_mob').value,
                    managerWA: document.getElementById('m_wa').value
                },
                supplyChain: {
                    fullUdaipur: document.getElementById('area_full').checked,
                    radius25km: document.getElementById('area_radius').checked,
                    primeLocations: Array.from(document.querySelectorAll('.loc-check:checked')).map(el => el.value),
                    materials: mats
                },
                fleet: {
                    tractor: document.getElementById('fl_tractor').innerText,
                    mini: document.getElementById('fl_minitruck').innerText,
                    truck: document.getElementById('fl_truck').innerText,
                    dumper: document.getElementById('fl_dumper').innerText,
                    trailer: document.getElementById('fl_trailer').innerText
                },
                photos: UIEngine.photos,
                address: document.getElementById('form_address').value
            };

            await addDoc(collection(window.db, "surveys"), payload);
            alert("SUCCESS: Enterprise Sync Complete!");
            location.reload();

        } catch (error) {
            alert("Sync Failed: " + error.message);
            if (syncBtn) {
                syncBtn.innerHTML = "🚀 RETRY SUBMISSION";
                syncBtn.disabled = false;
            }
        }
    }
};
window.SupplierEngine = SupplierEngine;
