/**
 * INFRA DEPOT - ADMIN PANEL v6.0 (HEAT MAP & MARKET INTEL)
 */
const AdminEngine = {
    map: null,
    markers: [],

    init: function(isSuper) {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div><small>INFRA DEPOT v6.0</small><br><b style="color:var(--accent)">MARKET INTELLIGENCE</b></div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-circle" onclick="AdminEngine.showPassChange()">🔐</button>
                        <button class="btn-circle" onclick="App.logout()">✕</button>
                    </div>
                </div>

                <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--accent);">
                    <div style="padding:10px; background:rgba(45, 212, 191, 0.1); display:flex; justify-content:space-between;">
                        <small>LIVE SUPPLY HEAT MAP</small>
                        <small id="map_status" style="color:var(--accent)">Loading Pins...</small>
                    </div>
                    <div id="admin_map" style="width:100%; height:300px; background:#111;"></div>
                </div>

                <div class="dashboard-grid" style="margin-top:15px;">
                    <div class="stat"><small>MAPPED SHOPS</small><div id="adm_total">0</div></div>
                    <div class="stat"><small>ACTIVE SITES</small><div id="site_count">0</div></div>
                </div>

                ${isSuper ? `
                <div class="card">
                    <div class="section-label">👥 ONBOARD FIELD FORCE</div>
                    <div style="display:flex; gap:10px; margin-bottom:15px; overflow-x:auto; padding-bottom:5px;" id="rbac_list"></div>
                    
                    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px;">
                        <select id="new_u_role" onchange="AdminEngine.updateIDPreview()" style="width:100%; padding:12px; background:#000; color:white; border-radius:10px; margin-bottom:10px;">
                            <option value="">Select Staff Role...</option>
                            <option value="field_staff">Supplier Scout (FS)</option>
                            <option value="site_scout">Site Surveyor (SS)</option>
                        </select>
                        <div id="id_preview_box" style="display:none; padding:10px; text-align:center; border:1px dashed var(--accent); margin-bottom:10px;">
                            <small>NEW ID:</small> <b id="generated_id_display" style="color:var(--accent)"></b>
                        </div>
                        <input type="text" id="new_u_name" placeholder="Staff Name">
                        <input type="tel" id="new_u_phone" placeholder="WhatsApp">
                        <input type="email" id="new_u_email" placeholder="Email">
                        <button id="save_user_btn" class="btn-main btn-green" disabled onclick="AdminEngine.saveUser()">ACTIVATE STAFF</button>
                    </div>
                </div>
                ` : ''}

                <div class="card">
                    <div class="section-label">📋 MARKET FEED</div>
                    <div id="admin_feed" style="max-height:300px; overflow-y:auto;"></div>
                </div>
            </div>
        `;
        
        this.refreshUserList();
        this.initAdminMap();
        this.loadMarketData();
    },

    initAdminMap: function() {
        // Initialize Leaflet Map centered on Udaipur
        setTimeout(() => {
            this.map = L.map('admin_map').setView([24.5854, 73.7125], 12);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(this.map);
        }, 500);
    },

    loadMarketData: async function() {
        try {
            const { collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(query(collection(window.db, "surveys"), orderBy("timestamp", "desc")));
            
            document.getElementById('adm_total').innerText = snap.size;
            let html = "";

            snap.forEach(doc => {
                const d = doc.data();
                const coords = d.location?.coords;

                // 📍 Add Pin to Map if GPS exists
                if (coords && coords.latitude && this.map) {
                    const marker = L.circleMarker([coords.latitude, coords.longitude], {
                        color: 'var(--accent)',
                        radius: 8,
                        fillOpacity: 0.6
                    }).addTo(this.map)
                    .bindPopup(`<b>${d.business?.firm}</b><br>Owner: ${d.business?.owner}<br>Fleet: ${d.fleet?.truck || 0} Trucks`);
                }

                html += `
                    <div class="mat-row" style="border-left: 3px solid var(--accent); margin-bottom:8px; padding:10px;">
                        <div style="display:flex; justify-content:space-between;">
                            <b>${d.business?.firm || "Unnamed Store"}</b>
                            <small style="color:var(--accent)">${d.business?.owner || ""}</small>
                        </div>
                        <div style="font-size:10px; opacity:0.6; margin-top:5px;">
                            📍 ${d.location?.address?.substring(0,40)}...
                        </div>
                    </div>
                `;
            });
            document.getElementById('admin_feed').innerHTML = html;
            document.getElementById('map_status').innerText = "Live: Udaipur Market";
        } catch (e) { console.error(e); }
    },

    // ... (Keep updateIDPreview, saveUser, showPassChange from previous v5.6)
    
    updateIDPreview: function() {
        const role = document.getElementById('new_u_role').value;
        if (!role) { document.getElementById('id_preview_box').style.display = "none"; return; }
        let prefix = role === "admin" ? "AD" : (role === "site_scout" ? "SS" : "FS");
        const digits = Math.floor(100000 + Math.random() * 900000);
        this.lastGeneratedID = prefix + digits;
        document.getElementById('generated_id_display').innerText = this.lastGeneratedID;
        document.getElementById('id_preview_box').style.display = "block";
        document.getElementById('save_user_btn').disabled = false;
    },

    saveUser: async function() {
        const name = document.getElementById('new_u_name').value.trim();
        const phone = document.getElementById('new_u_phone').value.trim();
        const email = document.getElementById('new_u_email').value.trim();
        const role = document.getElementById('new_u_role').value;
        const id = this.lastGeneratedID;

        if (!name || !phone || !email) return alert("All fields required");

        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(window.db, "users", id), {
                name: name, role: role, password: id, phone: phone, email: email, is_first_login: true, created: new Date().toISOString()
            });

            const msg = `*🏗️ INFRA DEPOT ACCESS*%0AWelcome ${name}. ID: *${id}*. Login: https://nirman-sutra.github.io`;
            window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
            window.open(`mailto:${email}?subject=InfraDepot Credentials&body=ID: ${id}`, '_blank');

            alert("Staff Activated!");
            location.reload();
        } catch (e) { alert(e.message); }
    },

    refreshUserList: async function() {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const snap = await getDocs(collection(window.db, "users"));
        let html = "";
        snap.forEach(u => {
            const d = u.data();
            html += `<div style="min-width:100px; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; text-align:center;">
                <small style="color:var(--accent)">${u.id}</small><br><b style="font-size:10px;">${d.name.split(' ')[0]}</b>
            </div>`;
        });
        document.getElementById('rbac_list').innerHTML = html;
    }
};
window.AdminEngine = AdminEngine;
