/**
 * INFRA DEPOT - ADMIN PANEL v6.2 (PWD RESET & OVERRIDE)
 */
const AdminEngine = {
    map: null,

    init: function(isSuper) {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div><small>INFRA DEPOT</small><br><b style="color:var(--accent)">${isSuper ? 'SUPER ADMIN' : 'MANAGER'}</b></div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-circle" onclick="AdminEngine.showPassChange()">🔐</button>
                        <button class="btn-circle" onclick="App.logout()">✕</button>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="stat"><small>DATA</small><div id="adm_total">0</div></div>
                    <div class="stat"><small>STAFF</small><div id="adm_staff_count">0</div></div>
                </div>

                ${isSuper ? `
                <div class="card" style="border: 1px solid var(--accent);">
                    <div class="section-label">👥 STAFF DIRECTORY & SECURITY</div>
                    
                    <div id="rbac_list" style="margin-bottom:20px; max-height:250px; overflow-y:auto; background:rgba(0,0,0,0.2); border-radius:10px;">
                        <p style="padding:15px; opacity:0.5; font-size:12px;">Accessing Directory...</p>
                    </div>

                    <div style="background:rgba(45, 212, 191, 0.05); padding:15px; border-radius:12px;">
                        <small style="color:var(--accent)">ADD NEW TEAM MEMBER</small>
                        <select id="new_u_role" onchange="AdminEngine.updateIDPreview()" style="width:100%; padding:12px; background:#000; color:white; border-radius:10px; margin: 10px 0;">
                            <option value="">Select Role...</option>
                            <option value="field_staff">Field Staff (FS)</option>
                            <option value="admin">Admin (AD)</option>
                        </select>
                        <div id="id_preview_box" style="padding:12px; background:rgba(0,0,0,0.3); border-radius:10px; text-align:center; margin-bottom:10px; display:none;">
                            <small style="opacity:0.7">GENERATED LOGIN:</small> <b id="generated_id_display" style="color:var(--accent);"></b>
                        </div>
                        <input type="text" id="new_u_name" placeholder="Full Name">
                        <input type="tel" id="new_u_phone" placeholder="WhatsApp Number">
                        <input type="email" id="new_u_email" placeholder="Email Address">
                        <button id="save_user_btn" class="btn-main btn-green" disabled onclick="AdminEngine.saveUser()">ONBOARD STAFF</button>
                    </div>
                </div>
                ` : ''}

                <div class="card" style="padding:0; overflow:hidden; height:180px; margin-top:15px;">
                    <div id="admin_map" style="width:100%; height:100%; background:#111;"></div>
                </div>

                <div class="card">
                    <div class="section-label">📊 SURVEY FEED</div>
                    <div id="admin_feed"></div>
                </div>
            </div>
        `;
        
        this.refreshUserList();
        this.initAdminMap();
        this.loadSurveyData();
    },

    refreshUserList: async function() {
        const rbacList = document.getElementById('rbac_list');
        if (!rbacList) return;

        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.db, "users"));
            document.getElementById('adm_staff_count').innerText = snap.size;
            
            let html = `
                <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
                    <tr style="opacity:0.6; border-bottom:1px solid #333;">
                        <th style="padding:10px;">ID/ROLE</th>
                        <th>PASSWORD</th>
                        <th style="text-align:right; padding-right:10px;">MANAGE</th>
                    </tr>
            `;

            snap.forEach(u => {
                const d = u.data();
                const isMaster = u.id === 'vijay_master';
                html += `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:12px 10px;">
                            <b style="color:var(--accent)">${u.id}</b><br>
                            <span style="font-size:9px; opacity:0.6">${d.name || 'No Name'}</span>
                        </td>
                        <td><span style="font-family:monospace; background:rgba(255,255,255,0.05); padding:2px 4px;">${d.password}</span></td>
                        <td style="text-align:right; padding-right:10px;">
                            ${isMaster ? '' : `
                                <button onclick="AdminEngine.resetUserPassword('${u.id}')" title="Reset to Default" style="background:none; border:none; color:var(--accent); margin-right:10px; cursor:pointer;">🔄</button>
                                <button onclick="AdminEngine.deleteUser('${u.id}')" title="Delete" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
                            `}
                        </td>
                    </tr>
                `;
            });
            html += `</table>`;
            rbacList.innerHTML = html;
        } catch (e) { console.error(e); }
    },

    resetUserPassword: async function(userId) {
        if (confirm(`RESET PASSWORD for ${userId}?\nThis will set password to '${userId}' and force a change on next login.`)) {
            try {
                const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                await updateDoc(doc(window.db, "users", userId), {
                    password: userId,
                    is_first_login: true
                });
                alert(`Password Reset Successful for ${userId}`);
                this.refreshUserList();
            } catch (e) { alert("Reset Failed"); }
        }
    },

    updateIDPreview: function() {
        const role = document.getElementById('new_u_role').value;
        if (!role) { document.getElementById('id_preview_box').style.display = "none"; return; }
        let prefix = role === "admin" ? "AD" : "FS";
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
            alert("Staff Onboarded! Notification links triggered.");
            this.refreshUserList();
        } catch (e) { alert(e.message); }
    },

    initAdminMap: function() {
        setTimeout(() => {
            if (document.getElementById('admin_map') && !this.map) {
                this.map = L.map('admin_map').setView([24.5854, 73.7125], 11);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(this.map);
            }
        }, 1000);
    },

    loadSurveyData: async function() {
        const { collection, getDocs, query, orderBy, limit } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const snap = await getDocs(query(collection(window.db, "surveys"), orderBy("timestamp", "desc"), limit(20)));
        document.getElementById('adm_total').innerText = snap.size;
        let html = "";
        snap.forEach(doc => {
            const d = doc.data();
            html += `<div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.05); font-size:12px;"><b>${d.business?.firm || "Unnamed"}</b><br><small style="opacity:0.6">${d.timestamp.split('T')[0]}</small></div>`;
        });
        document.getElementById('admin_feed').innerHTML = html;
    },

    deleteUser: async function(id) {
        if(confirm(`Remove access for ${id}?`)) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(window.db, "users", id));
            this.refreshUserList();
        }
    },

    showPassChange: function() {
        const modal = document.createElement('div');
        modal.id = "pass_modal_adm";
        modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;";
        modal.innerHTML = `
            <div class="card" style="width:100%; max-width:400px; border:1px solid var(--accent);">
                <div class="section-label">🔐 CHANGE YOUR PASSWORD</div>
                <input type="password" id="adm_pass_new" placeholder="Enter New Password">
                <input type="password" id="adm_pass_conf" placeholder="Confirm New Password">
                <button class="btn-main btn-green" onclick="AdminEngine.updateMyPassword()">UPDATE PASSWORD</button>
                <button class="btn-main btn-gray" style="margin-top:10px;" onclick="document.getElementById('pass_modal_adm').remove()">CANCEL</button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    updateMyPassword: async function() {
        const p1 = document.getElementById('adm_pass_new').value.trim();
        const p2 = document.getElementById('adm_pass_conf').value.trim();
        const user = JSON.parse(localStorage.getItem('infra_user'));
        if (!p1 || p1 !== p2) return alert("Passwords do not match!");
        try {
            const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await updateDoc(doc(window.db, "users", user.id), { password: p1 });
            alert("Password updated!");
            document.getElementById('pass_modal_adm').remove();
        } catch (e) { alert("Error"); }
    }
};
window.AdminEngine = AdminEngine;
