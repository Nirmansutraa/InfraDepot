/**
 * INFRA DEPOT - SUPER ADMIN COMMAND CENTER (v5.2)
 * Fix: Real-time ID Generation Preview
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
                            <small style="opacity:0.7">GENERATED LOGIN ID:</small><br>
                            <b id="generated_id_display" style="font-size:18px; color:var(--accent); letter-spacing:2px;"></b>
                        </div>

                        <input type="text" id="new_u_name" placeholder="Staff Full Name">
                        
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
        this.loadSurveyData(isSuper);
    },

    // 🎲 UPDATED: Visual ID Generator
    updateIDPreview: function() {
        const role = document.getElementById('new_u_role').value;
        const previewBox = document.getElementById('id_preview_box');
        const display = document.getElementById('generated_id_display');
        const btn = document.getElementById('save_user_btn');

        if (!role) {
            previewBox.style.display = "none";
            btn.disabled = true;
            return;
        }

        let prefix = "FS";
        if (role === "admin") prefix = "AD";
        if (role === "super_admin") prefix = "SA";

        const digits = Math.floor(100000 + Math.random() * 900000);
        const finalID = prefix + digits;

        display.innerText = finalID;
        previewBox.style.display = "block";
        btn.disabled = false;
        this.lastGeneratedID = finalID; // Temporarily store it
    },

    saveUser: async function() {
        const name = document.getElementById('new_u_name').value.trim();
        const role = document.getElementById('new_u_role').value;
        const generatedID = this.lastGeneratedID;

        if (!name) return alert("Please enter a Full Name");

        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            await setDoc(doc(window.db, "users", generatedID), {
                name: name,
                role: role,
                created: new Date().toISOString()
            });

            alert(`User Successfully Created!\nID: ${generatedID}\nName: ${name}`);
            
            // Reset Form
            document.getElementById('new_u_name').value = "";
            document.getElementById('new_u_role').value = "";
            document.getElementById('id_preview_box').style.display = "none";
            document.getElementById('save_user_btn').disabled = true;
            
            this.refreshUserList();
        } catch (e) {
            alert("Error: " + e.message);
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
                            <span style="font-size:11px; opacity:0.8;">${data.name || 'No Name'}</span>
                        </div>
                        <button onclick="AdminEngine.deleteUser('${u.id}')" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
                    </div>
                `;
            });
            rbacList.innerHTML = html;
        } catch (e) { console.error(e); }
    },

    deleteUser: async function(id) {
        if(id === "vijay_master") return alert("Cannot delete Master account!");
        if(confirm(`Delete ${id}?`)) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await deleteDoc(doc(window.db, "users", id));
            this.refreshUserList();
        }
    },

    loadSurveyData: async function() {
        try {
            const { collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(query(collection(window.db, "surveys"), orderBy("timestamp", "desc")));
            document.getElementById('adm_total').innerText = snap.size;
            let html = "";
            snap.forEach(doc => {
                const d = doc.data();
                html += `
                    <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:12px; margin-bottom:10px; border-left:4px solid var(--accent);">
                        <b>${d.business?.firm || "Unnamed"}</b><br>
                        <small style="opacity:0.6">${d.timestamp.split('T')[0]}</small>
                    </div>
                `;
            });
            document.getElementById('admin_feed').innerHTML = html;
        } catch (e) { console.error(e); }
    }
};
window.AdminEngine = AdminEngine;
