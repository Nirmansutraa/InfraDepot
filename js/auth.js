/**
 * INFRA DEPOT - AUTH ENGINE v5.5 (FORCED PASSWORD CHANGE)
 */
const AuthEngine = {
    init: function() {
        const session = localStorage.getItem('infra_user');
        if (session) { this.launchRoleBasedUI(JSON.parse(session)); } 
        else { this.renderLogin(); }
    },

    renderLogin: function() {
        document.getElementById('auth_layer').innerHTML = `
            <div class="container" style="padding-top:80px; text-align:center;">
                <h1 style="color:var(--accent); letter-spacing:3px;">INFRA DEPOT</h1>
                <div class="card" style="margin-top:30px;">
                    <input type="text" id="login_id" placeholder="Staff ID">
                    <input type="password" id="login_pass" placeholder="Password">
                    <button class="btn-main btn-green" onclick="AuthEngine.handleLogin()">🔓 LOGIN</button>
                </div>
            </div>
        `;
    },

    handleLogin: async function() {
        const id = document.getElementById('login_id').value.trim();
        const pass = document.getElementById('login_pass').value.trim();

        try {
            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const userSnap = await getDoc(doc(window.db, "users", id));

            if (userSnap.exists() && userSnap.data().password === pass) {
                const userData = userSnap.data();
                localStorage.setItem('infra_user', JSON.stringify({ id: id, ...userData }));
                
                // --- 🛡️ FORCED CHANGE CHECK ---
                if (userData.is_first_login) {
                    alert("First Login Detected. You must change your password now.");
                    location.reload(); // Reload triggers init() which will route to password change
                } else {
                    location.reload();
                }
            } else {
                alert("Invalid ID or Password");
            }
        } catch (e) { alert("Auth Error"); }
    },

    launchRoleBasedUI: function(user) {
        document.getElementById('auth_layer').style.display = 'none';
        
        // 🛡️ If First Login, hijack the screen
        if (user.is_first_login) {
            this.renderForcedChange(user.id);
            return;
        }

        if (user.role === "super_admin" || user.role === "admin") {
            AdminEngine.init(user.role === "super_admin");
        } else {
            UIEngine.init();
        }
    },

    renderForcedChange: function(id) {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';
        appLayer.innerHTML = `
            <div class="container" style="padding-top:50px;">
                <div class="card" style="border: 2px solid var(--accent);">
                    <div class="section-label">🔐 SECURE YOUR ACCOUNT</div>
                    <p style="font-size:12px; opacity:0.7;">Please set a new private password for ID: ${id}</p>
                    <input type="password" id="forced_pass_1" placeholder="New Password">
                    <input type="password" id="forced_pass_2" placeholder="Confirm Password">
                    <button class="btn-main btn-green" onclick="AuthEngine.applyForcedChange('${id}')">SAVE & ACTIVATE</button>
                </div>
            </div>
        `;
    },

    applyForcedChange: async function(id) {
        const p1 = document.getElementById('forced_pass_1').value.trim();
        const p2 = document.getElementById('forced_pass_2').value.trim();

        if (!p1 || p1 !== p2) return alert("Passwords must match!");

        try {
            const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            await updateDoc(doc(window.db, "users", id), {
                password: p1,
                is_first_login: false // Remove the restriction
            });
            
            // Update local storage and enter app
            let user = JSON.parse(localStorage.getItem('infra_user'));
            user.is_first_login = false;
            localStorage.setItem('infra_user', JSON.stringify(user));
            
            alert("Account Secured! Welcome to Infra Depot.");
            location.reload();
        } catch (e) { alert("Error updating security."); }
    },

    logout: function() {
        localStorage.clear();
        location.reload();
    }
};
window.App = AuthEngine;
