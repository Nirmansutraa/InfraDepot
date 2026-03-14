/**
 * INFRA DEPOT - ROBUST SYNC ENGINE
 */

const SupplierEngine = {
    loadDashboardStats: async function() {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.db, "surveys"));
            const count = snap.size;
            document.getElementById('stat_today').innerText = count;
            document.getElementById('stat_year').innerText = count;
        } catch (e) { console.warn("Stats offline."); }
    },

    syncToCloud: async function() {
        const btn = document.getElementById('sync_btn');
        if (btn) { btn.innerHTML = "🌀 SYNCING..."; btn.disabled = true; }

        try {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            const mats = {};
            document.querySelectorAll('.mat-main-check:checked').forEach(m => {
                const n = m.value;
                mats[n] = { 
                    vars: Array.from(document.querySelectorAll(`.v-check[data-mat="${n}"]:checked`)).map(el => el.value),
                    brands: Array.from(document.querySelectorAll(`.b-check[data-mat="${n}"]:checked`)).map(el => el.value)
                };
            });

            const payload = {
                timestamp: new Date().toISOString(),
                staff: localStorage.getItem('infra_session') || "FS-001",
                business: {
                    firm: document.getElementById('f_name')?.value || "",
                    owner: document.getElementById('o_name')?.value || "",
                    o_mob: document.getElementById('o_mob')?.value || "",
                    o_wa: document.getElementById('o_wa')?.value || "",
                    m_mob: document.getElementById('m_mob')?.value || "",
                    m_wa: document.getElementById('m_wa')?.value || ""
                },
                fleet: {
                    tractor: document.getElementById('fl_tractor')?.innerText || "0",
                    mini: document.getElementById('fl_minitruck')?.innerText || "0",
                    truck: document.getElementById('fl_truck')?.innerText || "0",
                    dumper: document.getElementById('fl_dumper')?.innerText || "0",
                    trailer: document.getElementById('fl_trailer')?.innerText || "0"
                },
                location: {
                    address: document.getElementById('form_address')?.value || "",
                    coords: document.getElementById('form_coords')?.value || "",
                    prime: Array.from(document.querySelectorAll('.loc-check:checked')).map(el => el.value)
                },
                materials: mats,
                photos: UIEngine.photos
            };

            await addDoc(collection(window.db, "surveys"), payload);
            alert("SUCCESS! Survey Synced Offline/Online.");
            location.reload();

        } catch (e) {
            alert("Sync Failed: " + e.message);
            if (btn) { btn.disabled = false; btn.innerHTML = "🚀 RETRY SYNC"; }
        }
    }
};
window.SupplierEngine = SupplierEngine;
