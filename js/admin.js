/**
 * INFRA DEPOT - SUPER ADMIN COMMAND CENTER
 * Features: Staff Mgmt, Live Feed, CSV Export
 */

const AdminEngine = {
    init: function(isSuper) {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div><small>CONTROL PANEL</small><br><b style="color:var(--accent)">${isSuper ? 'SUPER ADMIN' : 'MANAGER'}</b></div>
                    <button class="btn-circle" style="background:rgba(255,255,255,0.1)" onclick="App.logout()">✕</button>
                </div>

                <div class="dashboard-grid">
                    <div class="stat"><small>TOTAL</small><div id="adm_total">0</div></div>
                    <div class="stat"><small>TODAY</small><div id="adm_today">0</div></div>
                    <div class="stat"><small>STAFF</small><div id="adm_staff">0</div></div>
                </div>

                <div class="card" style="border: 1px dashed var(--accent);">
                    <div class="section-label">📥 BUSINESS INTELLIGENCE</div>
                    <p style="font-size:11px; opacity:0.7;">Download all survey records to Excel/CSV for analysis.</p>
                    <button class="btn-main btn-gray" onclick="AdminEngine.exportToCSV()">📊 DOWNLOAD DATA (CSV)</button>
                </div>

                <div class="card">
                    <div class="section-label">📡 LIVE SURVEY STREAM</div>
                    <div id="admin_feed" style="max-height:450px; overflow-y:auto; padding-right:5px;">
                        <p style="text-align:center; opacity:0.5;">Connecting to secure stream...</p>
                    </div>
                </div>
            </div>
        `;
        this.loadAdminData(isSuper);
    },

    loadAdminData: async function(canDelete) {
        try {
            const { collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const q = query(collection(window.db, "surveys"), orderBy("timestamp", "desc"));
            const snap = await getDocs(q);
            
            const todayStr = new Date().toISOString().split('T')[0];
            let todayCount = 0;
            let html = "";
            let rawData = [];

            snap.forEach(doc => {
                const d = doc.data();
                rawData.push(d);
                if (d.timestamp.startsWith(todayStr)) todayCount++;

                html += `
                    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; margin-bottom:12px; border-left:4px solid var(--accent);">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div>
                                <b style="font-size:15px; color:var(--accent);">${d.business?.firm || "Unnamed Firm"}</b>
                                <div style="font-size:11px; opacity:0.6; margin-top:2px;">👤 Owner: ${d.business?.owner || 'N/A'}</div>
                            </div>
                            <small style="font-size:10px; opacity:0.5;">${d.timestamp.split('T')[0]}</small>
                        </div>
                        
                        <div style="margin-top:10px; display:flex; gap:8px;">
                            <button class="btn-step" style="width:auto; padding:0 12px; font-size:10px;" onclick="window.open('https://wa.me/91${d.business?.o_mob}')">WHATSAPP</button>
                            <button class="btn-step" style="width:auto; padding:0 12px; font-size:10px; background:#34495e; color:white;" onclick="AdminEngine.viewDetails('${doc.id}')">DETAILS</button>
                            ${canDelete ? `<button class="btn-step" style="width:auto; padding:0 12px; font-size:10px; background:#c0392b; color:white;" onclick="AdminEngine.deleteEntry('${doc.id}')">DEL</button>` : ''}
                        </div>
                    </div>
                `;
            });

            document.getElementById('adm_total').innerText = snap.size;
            document.getElementById('adm_today').innerText = todayCount;
            document.getElementById('adm_staff').innerText = Object.keys(AuthEngine.users).filter(id => id.startsWith('FS')).length;
            document.getElementById('admin_feed').innerHTML = html || "<p style='text-align:center;'>No surveys found.</p>";
            
            this.currentData = rawData; // Store for CSV export
        } catch (e) {
            console.error("Admin Load Error:", e);
        }
    },

    exportToCSV: function() {
        if (!this.currentData || this.currentData.length === 0) return alert("No data to export.");

        let csv = "Timestamp,Firm Name,Owner,Mobile,Address,Tractors,MiniTrucks,Dumpers\n";
        
        this.currentData.forEach(row => {
            csv += `${row.timestamp},${row.business?.firm},${row.business?.owner},${row.business?.o_mob},"${row.location?.address}",${row.fleet?.tractor},${row.fleet?.mini},${row.fleet?.dumper}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `InfraDepot_Data_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },

    deleteEntry: async function(id) {
        if (confirm("🚨 PERMANENT DELETE: Are you sure?")) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(window.db, "surveys", id));
            location.reload();
        }
    }
};

window.AdminEngine = AdminEngine;
