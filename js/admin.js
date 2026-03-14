/**
 * INFRA DEPOT - ADMIN ENGINE v1.5
 */
export const AdminEngine = {
    init: function(isFullAdmin) {
        console.log("Admin: Initializing Dashboard...");
        const viewport = document.getElementById('main_viewport');
        if (!viewport) return;

        viewport.innerHTML = `
            <div style="padding:20px; background:#f3f4f6; min-height:100vh;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h2 style="margin:0; font-size:18px;">SUPER ADMIN</h2>
                    <button onclick="localStorage.clear(); location.reload();" style="background:#ef4444; color:#fff; border:none; padding:8px 15px; border-radius:5px; font-weight:bold;">LOGOUT</button>
                </div>
                
                <div id="admin_stats" class="dashboard-grid">
                    <div class="stat"><small>DATA</small><div id="total_data">...</div></div>
                    <div class="stat"><small>STAFF</small><div id="total_staff">...</div></div>
                </div>

                <div class="card">
                    <div class="section-label">SURVEY FEED</div>
                    <div id="survey_list" style="max-height:300px; overflow-y:auto;">Loading...</div>
                </div>

                <div class="card">
                    <div class="section-label">LIVE INFRA MAP</div>
                    <div id="admin_map" style="height:300px; border-radius:10px;"></div>
                </div>
            </div>
        `;

        // Wait a split second for HTML to settle, then load Map and Data
        setTimeout(() => {
            if (window.MapEngine) window.MapEngine.init('admin_map');
            this.fetchLiveIntel();
        }, 300);
    },

    fetchLiveIntel: async function() {
        try {
            const { collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            const q = query(collection(window.db, "surveys"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            
            const list = document.getElementById('survey_list');
            const totalData = document.getElementById('total_data');
            
            let html = "";
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                html += `<div style="padding:10px; border-bottom:1px solid #eee; font-size:12px;">
                            <b>${data.firmName || 'Unnamed'}</b><br>
                            <small>${data.address || 'No Address'}</small>
                         </div>`;
            });
            
            list.innerHTML = html || "No records found.";
            totalData.innerText = querySnapshot.size;
        } catch (e) {
            console.error("Admin Fetch Error:", e);
        }
    }
};

window.AdminEngine = AdminEngine;
