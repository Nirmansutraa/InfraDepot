/**
 * INFRA DEPOT - SUPER ADMIN COMMAND CENTER (v5.0)
 * Includes: Full RBAC User Management
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
                    <div class="section-label">👥 RBAC USER CONTROL</div>
                    
                    <div id="rbac_list" style="margin-bottom:20px;"></div>

                    <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:12px;">
                        <small style="color:var(--accent)">CREATE NEW USER</small>
                        <input type="text" id="new_u_id" placeholder="Staff ID (Unique)" style="margin-top:10px;">
                        <input type="text" id="new_u_name" placeholder="Full Name">
                        <select id="new_u_role" style="width:100%; padding:12px; background:#000; color:white; border-radius:10px; margin-bottom:10px;">
                            <option value="field_staff">Field Staff (Input Only)</option>
                            <option value="admin">Admin (View Only)</option>
                            <option value="super_admin">Super Admin (Full Access)</option>
                        </select>
                        <button class="btn-main btn-green" onclick="AdminEngine.saveUser()">SAVE USER TO CLOUD</button>
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
        this.loadSurveyData(isSuper);
    },

    // 🔐 RBAC: Save User to Firebase
    saveUser: async function() {
        const id = document.getElementById('new_u_id').value.trim();
        const name = document.getElementById('new_u_name').value.trim();
        const role = document.getElementById('new_u_role').value;

        if (!id || !name) return alert("Fill all details");

        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        await setDoc(doc(window.db, "users", id), {
            name: name,
            role: role,
            created: new Date().toISOString()
        });

        alert("User Created Successfully!");
        this.refreshUserList();
    },

    // 🔐 RBAC: Load and Delete Users
    refreshUserList: async function() {
        const rbacList = document.getElementById('rbac_list');
        if (!rbacList) return;

        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const snap = await getDocs(collection(window.db, "users"));
        
        document.getElementById('adm_staff_count').innerText = snap.size;
        
        let html = "";
        snap.forEach(u => {
            const data = u.data();
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #333;">
                    <div>
                        <b>${u.id}</b> <small style="color:var(--accent)">[${data.role}]</small><br>
                        <span style="font-size:11px; opacity:0.6;">${data.name}</span>
                    </div>
                    <button onclick="AdminEngine.deleteUser('${u.id}')" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
                </div>
            `;
        });
        rbacList.innerHTML = html;
    },

    deleteUser: async function(id) {
        if(confirm(`Remove access for ${id}?`)) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(window.db, "users", id));
            this.refreshUserList();
        }
    },

    loadSurveyData: async function(canDelete) {
        const { collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const snap = await getDocs(query(collection(window.db, "surveys"), orderBy("timestamp", "desc")));
        document.getElementById('adm_total').innerText = snap.size;
        
        let html = "";
        snap.forEach(doc => {
            const d = doc.data();
            html += `
                <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:12px; margin-bottom:10px; border-left:4px solid var(--accent);">
                    <b>${d.business?.firm || "Unnamed"}</b><br>
                    <small>${d.timestamp.split('T')[0]} by ${d.staff || 'N/A'}</small>
                </div>
            `;
        });
        document.getElementById('admin_feed').innerHTML = html;
    }
};
window.AdminEngine = AdminEngine;
