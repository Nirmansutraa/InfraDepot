/**
 * INFRA DEPOT - ADMIN PANEL v5.6 (DUAL NOTIFY)
 */
const AdminEngine = {
    init: function(isSuper) {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div><small>CONTROL PANEL</small><br><b style="color:var(--accent)">${isSuper ? 'SUPER ADMIN' : 'MANAGER'}</b></div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-circle" style="background:rgba(45, 212, 191, 0.2)" onclick="AdminEngine.showPassChange()">🔐</button>
                        <button class="btn-circle" style="background:rgba(255,255,255,0.1)" onclick="App.logout()">✕</button>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="stat"><small>DATA</small><div id="adm_total">0</div></div>
                    <div class="stat"><small>STAFF</small><div id="adm_staff_count">0</div></div>
                </div>

                ${isSuper ? `
                <div class="card" style="border: 1px solid var(--accent);">
                    <div class="section-label">👥 ONBOARD NEW STAFF</div>
                    
                    <div id="rbac_list" style="margin-bottom:20px; max-height:150px; overflow-y:auto;"></div>

                    <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:12px;">
                        <select id="new_u_role" onchange="AdminEngine.updateIDPreview()" style="width:100%; padding:12px; background:#000; color:white; border-radius:10px; margin-bottom:10px;">
                            <option value="">Select Role...</option>
                            <option value="field_staff">Field Staff (FS)</option>
                            <option value="admin">Admin (AD)</option>
                        </select>

                        <div id="id_preview_box" style="padding:12px; background:rgba(45, 212, 191, 0.1); border:1px dashed var(--accent); border-radius:10px; text-align:center; margin-bottom:10px; display:none;">
                            <small style="opacity:0.7">GENERATED ID:</small> <b id="generated_id_display" style="color:var(--accent);"></b>
                        </div>

                        <input type="text" id="new_u_name" placeholder="Full Name">
                        <input type="tel" id="new_u_phone" placeholder="WhatsApp Number">
                        <input type="email" id="new_u_email" placeholder="Email Address">
                        
                        <button id="save_user_btn" class="btn-main btn-green" disabled onclick="AdminEngine.saveUser()">SAVE & SEND ALERTS</button>
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
        if (!role) { document.getElementById('id_preview_box').style.display = "none"; return; }
        let prefix = role === "admin" ? "AD" : (role === "super_admin" ? "SA" : "FS");
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

        if (!name || !phone || !email) return alert("Please fill all details!");

        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await setDoc(doc(window.db, "users", id), {
                name: name,
                role: role,
                password: id,
                phone: phone,
                email: email,
                is_first_login: true,
                created: new Date().toISOString()
            });

            // 🟢 WHATSAPP ALERT
            const waMsg = `*🏗️ INFRA DEPOT ACCESS*%0AHello ${name}, your ID is: *${id}*.%0ATemp Pass: *${id}*.%0ALogin here: https://nirman-sutra.github.io`;
            window.open(`https://wa.me/91${phone}?text=${waMsg}`, '_blank');

            // 🔵 EMAIL ALERT (System will prompt to send)
            const mailSub = `Infra Depot Login Credentials for ${name}`;
            const mailBody = `Hello ${name},%0D%0A%0D%0AYour field staff account has been created.%0D%0A%0D%0AStaff ID: ${id}%0D%0ATemporary Password: ${id}%0D%0A%0D%0APlease login and change your password: https://nirman-sutra.github.io`;
            window.open(`mailto:${email}?subject=${mailSub}&body=${mailBody}`, '_blank');

            alert("Staff Onboarded! Alerts triggered for WhatsApp and Email.");
            location.reload();
        } catch (e) { alert(e.message); }
    },

    refreshUserList: async function() {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const snap = await getDocs(collection(window.db, "users"));
        document.getElementById('adm_staff_count').innerText = snap.size;
        let html = "";
        snap.forEach(u => {
            const d = u.data();
            html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #333;">
                <div><b>${u.id}</b> <small>(${d.role})</small><br><span style="font-size:10px; opacity:0.6;">${d.name}</span></div>
                <button onclick="AdminEngine.deleteUser('${u.id}')" style="color:red; background:none; border:none;">✕</button>
            </div>`;
        });
        document.getElementById('rbac_list').innerHTML = html;
    },

    // ... (Keep existing loadSurveyData, showPassChange, updateMyPassword, and deleteUser functions)
};
window.AdminEngine = AdminEngine;
