/**
 * INFRA DEPOT - ADMIN PANEL v5.3 (PASSWORD MANAGEMENT)
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
                    <div class="stat"><small>DATA</small><div id="adm_total">0</div></div>
                    <div class="stat"><small>STAFF</small><div id="adm_staff_count">0</div></div>
                </div>

                ${isSuper ? `
                <div class="card" style="border: 1px solid var(--accent);">
                    <div class="section-label">👥 USER & PASSWORD MGMT</div>
                    
                    <div id="rbac_list" style="margin-bottom:20px; max-height:150px; overflow-y:auto;"></div>

                    <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:12px;">
                        <small style="color:var(--accent)">CREATE NEW USER</small>
                        
                        <select id="new_u_role" onchange="AdminEngine.updateIDPreview()" style="width:100%; padding:12px; background:#000; color:white; border-radius:10px; margin: 10px 0;">
                            <option value="">Select Role...</option>
                            <option value="field_staff">Field Staff (FS)</option>
                            <option value="admin">Admin (AD)</option>
                            <option value="super_admin">Super Admin (SA)</option>
                        </select>

                        <div id="id_preview_box" style="padding:12px; background:rgba(45, 212, 191, 0.1); border:1px dashed var(--accent); border-radius:10px; text-align:center; margin-bottom:10px; display:none;">
                            <small style="opacity:0.7">LOGIN ID:</small> <b id="generated_id_display" style="color:var(--accent);"></b>
                        </div>

                        <input type="text" id="new_u_name" placeholder="Full Name">
                        <input type="password" id="new_u_pass" placeholder="Set Initial Password">
                        
                        <button id="save_user_btn" class="btn-main btn-green" disabled onclick="AdminEngine.saveUser()">SAVE USER TO CLOUD</button>
                    </div>
                </div>
                ` : ''}

                <div class="card">
                    <div class="section-label">📊 LIVE SURVEY DATA</div>
                    <div id="admin_feed"></div>
                </div>
            </div>
        `;
        this.refreshUserList();
        this.loadSurveyData();
    },

    updateIDPreview: function() {
        const role = document.getElementById('new_u_role').value;
        const previewBox = document.getElementById('id_preview_box');
        const display = document.getElementById('generated_id_display');
        const btn = document.getElementById('save_user_btn');

        if (!role) { previewBox.style.display = "none"; btn.disabled = true; return; }

        let prefix = role === "admin" ? "AD" : (role === "super_admin" ? "SA" : "FS");
        const digits = Math.floor(100000 + Math.random() * 900000);
        this.lastGeneratedID = prefix + digits;

        display.innerText = this.lastGeneratedID;
        previewBox.style.display = "block";
        btn.disabled = false;
    },

    saveUser: async function() {
        const name = document.getElementById('new_u_name').value.trim();
        const pass = document.getElementById('new_u_pass').value.trim();
        const role = document.getElementById('new_u_role').value;
        const id = this.lastGeneratedID;

        if (!name || !pass) return alert("Enter Name and Password");

        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(window.db, "users", id), {
                name: name,
                role: role,
                password: pass, // In production, we would hash this
                created: new Date().toISOString()
            });

            alert(`USER CREATED!\nID: ${id}\nPass: ${pass}`);
            location.reload();
        } catch (e) { alert(e.message); }
    },

    refreshUserList: async function() {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const snap = await getDocs(collection(window.db, "users"));
        document.getElementById('adm_staff_count').innerText = snap.size;
        
        let html = "";
        snap.forEach(u => {
            const data = u.data();
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #333;">
                    <div><b>${u.id}</b> <small>(${data.role})</small><br><span style="font-size:10px; opacity:0.6;">PWD: ${data.password}</span></div>
                    <button onclick="AdminEngine.deleteUser('${u.id}')" style="color:red; background:none; border:none;">✕</button>
                </div>`;
        });
        document.getElementById('rbac_list').innerHTML = html;
    },

    loadSurveyData: async function() {
        const { collection, getDocs, query, orderBy, limit } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const snap = await getDocs(query(collection(window.db, "surveys"), orderBy("timestamp", "desc"), limit(10)));
        document.getElementById('adm_total').innerText = snap.size;
        let html = "";
        snap.forEach(doc => {
            const d = doc.data();
            html += `<div class="mat-row"><b>${d.business?.firm}</b><br><small>${d.timestamp.split('T')[0]}</small></div>`;
        });
        document.getElementById('admin_feed').innerHTML = html;
    }
};
window.AdminEngine = AdminEngine;
