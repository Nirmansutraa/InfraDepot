/**
 * INFRA DEPOT - SUPER ADMIN & ANALYTICS PANEL
 */

const AdminEngine = {
    init: function(isSuper) {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h2 style="color:var(--accent)">ADMIN CORE</h2>
                    <button class="btn-circle" style="background:red" onclick="App.logout()">×</button>
                </div>

                <div class="dashboard-grid">
                    <div class="stat"><small>TOTAL</small><div id="adm_total">0</div></div>
                    <div class="stat"><small>NEW</small><div id="adm_new">0</div></div>
                    <div class="stat"><small>STAFF</small><div>3</div></div>
                    <div class="stat"><small>ALERTS</small><div>0</div></div>
                </div>

                ${isSuper ? `
                <div class="card">
                    <div class="section-label">👥 USER & ROLE MGMT</div>
                    <div style="display:flex; gap:10px;">
                        <input type="text" placeholder="New ID" style="flex:2;">
                        <select style="flex:1; background:#000; color:white; border-radius:10px; padding:5px;">
                            <option>Field</option>
                            <option>Admin</option>
                        </select>
                        <button style="background:var(--accent); border:none; border-radius:10px; padding:0 15px;">+</button>
                    </div>
                </div>
                ` : ''}

                <div class="card">
                    <div class="section-label">📊 LIVE SURVEY FEED</div>
                    <div id="admin_feed" style="max-height:400px; overflow-y:auto;">
                        Loading live data stream...
                    </div>
                </div>
            </div>
        `;
        this.loadLiveFeed(isSuper);
    },

    loadLiveFeed: async function(canDelete) {
        try {
            const { collection, getDocs, query, orderBy, deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const q = query(collection(window.db, "surveys"), orderBy("timestamp", "desc"));
            const snap = await getDocs(q);
            
            document.getElementById('adm_total').innerText = snap.size;
            const feed = document.getElementById('admin_feed');
            
            let html = "";
            snap.forEach(sv => {
                const d = sv.data();
                html += `
                    <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:12px; margin-bottom:10px; border-left:4px solid var(--accent);">
                        <div style="display:flex; justify-content:space-between;">
                            <b style="font-size:14px;">${d.business?.firm || "Unnamed"}</b>
                            <small style="opacity:0.6">${d.timestamp.split('T')[0]}</small>
                        </div>
                        <div style="font-size:11px; margin-top:5px;">👤 Owner: ${d.business?.owner} | 🛠️ ${Object.keys(d.materials || {}).join(', ')}</div>
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            <button class="btn-step" style="width:auto; padding:0 10px; font-size:10px;" onclick="window.open('https://wa.me/${d.business?.o_mob}')">WA</button>
                            ${canDelete ? `<button class="btn-step" style="width:auto; padding:0 10px; font-size:10px; background:red; color:white;" onclick="AdminEngine.deleteSurvey('${sv.id}')">DEL</button>` : ''}
                        </div>
                    </div>
                `;
            });
            feed.innerHTML = html;
        } catch (e) { console.error(e); }
    },

    deleteSurvey: async function(docId) {
        if(confirm("Confirm deletion? This cannot be undone.")) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(window.db, "surveys", docId));
            location.reload();
        }
    }
};

window.AdminEngine = AdminEngine;
