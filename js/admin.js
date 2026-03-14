/**
 * INFRA DEPOT - SUPER ADMIN COMMAND CENTER (v5.1)
 * Feature: Auto-ID Generation with Role Prefixes
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
                    
                    <div id="rbac_list" style="margin-bottom:20px; max-height:200px; overflow-y:auto;"></div>

                    <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:12px;">
                        <small style="color:var(--accent)">CREATE NEW USER</small>
                        <div style="margin-top:10px; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; font-size:12px; color:#aaa;">
                            ID will be auto-generated based on role.
                        </div>
                        <input type="text" id="new_u_name" placeholder="Full Name" style="margin-top:10px;">
                        <select id="new_u_role" style="width:100%; padding:12px; background:#000; color:white; border-radius:10px; margin-bottom:10px;">
                            <option value="field_staff">Field Staff (FS prefix)</option>
                            <option value="admin">Admin (AD prefix)</option>
                            <option value="super_admin">Super Admin (SA prefix)</option>
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

    // 🎲 NEW: Unique ID Generator
    generateID: function(role) {
        let prefix = "FS"; // Default
        if (role === "admin") prefix = "AD";
        if (role === "super_admin") prefix = "SA";

        // Generate 6 random digits
        const digits = Math.floor(100000 + Math.random() * 900000);
        return prefix + digits;
    },

    saveUser: async function() {
        const name = document.getElementById('new_u_name').value.trim();
        const role = document.getElementById('new_u_role').value;

        if (!name) return alert("Please enter a Full Name");

        // Generate the 8-character ID
        const generatedID = this.generateID(role);

        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            await setDoc(doc(window.db, "users", generatedID), {
                name: name,
                role: role,
                created: new Date().toISOString()
            });

            alert(`User Created!\nID: ${generatedID}\nName: ${name}`);
            document.getElementById('new_u_name').value = ""; // Clear form
            this.refreshUserList();
        } catch (e) {
            alert("Error creating user: " + e.message);
        }
    },

    refreshUserList: async function() {
        const rbacList = document.getElementById('rbac_list');
        if (!rbacList) return;

        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.db, "users"));
            document.getElementById('adm_staff_count').innerText = snap.size;
            
            let html = "";
            snap.forEach(u => {
                const data = u.data();
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #333;">
                        <div>
                            <b style="color:var(--accent)">${u.id}</b><br>
                            <span style="font-size:11px; opacity:0.8;">${data.name || 'No Name'} (${data.role})</span>
                        </div>
                        <button onclick="AdminEngine.deleteUser('${u.id}')" style="background:none; border:none; color:red; cursor:pointer; font-size:18px;">✕</button>
                    </div>
                `;
            });
            rbacList.innerHTML = html;
        } catch (e) { console.error(e); }
    },

    deleteUser: async function(id) {
        if(id === "vijay_master") return alert("Cannot delete the Master account!");
        if(confirm(`Remove access for ${id}?`)) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(window.db, "users", id));
            this.refreshUserList();
        }
    },

    loadSurveyData: async function(canDelete) {
        try {
            const { collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(query(collection(window.db, "surveys"), orderBy("timestamp", "desc")));
            document.getElementById('adm_total').innerText = snap.size;
            
            let html = "";
            snap.forEach(doc => {
                const d = doc.data();
                html += `
                    <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:12px; margin-bottom:10px; border-left:4px solid var(--accent);">
                        <b style="color:var(--accent)">${d.business?.firm || "Unnamed"}</b><br>
                        <small style="opacity:0.6">${d.timestamp.split('T')[0]} | Staff: ${d.staff || 'N/A'}</small>
                    </div>
                `;
            });
            document.getElementById('admin_feed').innerHTML = html || "No data yet.";
        } catch (e) { console.error(e); }
    }
};
window.AdminEngine = AdminEngine;
