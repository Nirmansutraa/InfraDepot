/**
 * INFRA DEPOT - IDENTITY & ROLE ENGINE 2026
 * Restricted Field Access Update
 */

const AuthEngine = {
    users: {
        "vijay_master": { role: "super_admin", name: "Vijay (Owner)" },
        "admin_01": { role: "admin", name: "Project Manager" },
        "FS-001": { role: "field_staff", name: "Field Surveyor 1" },
        "FS-002": { role: "field_staff", name: "Field Surveyor 2" }
    },

    init: function() {
        const session = localStorage.getItem('infra_user');
        if (session) {
            this.launchRoleBasedUI(JSON.parse(session));
        } else {
            this.renderLogin();
        }
    },

    renderLogin: function() {
        document.getElementById('auth_layer').innerHTML = `
            <div class="container" style="padding-top:100px; text-align:center;">
                <h1 style="color:var(--accent)">INFRA DEPOT</h1>
                <p style="opacity:0.7">Enterprise Survey System v4.0</p>
                <div class="card" style="margin-top:40px;">
                    <input type="text" id="login_id" placeholder="Enter Staff ID">
                    <button class="btn-main btn-green" onclick="AuthEngine.handleLogin()">SECURE LOGIN</button>
                    <p style="font-size:10px; margin-top:20px; opacity:0.5;">March 2026 Biometric Handshake Ready</p>
                </div>
            </div>
        `;
    },

    handleLogin: function() {
        const id = document.getElementById('login_id').value;
        const user = this.users[id];

        if (user) {
            localStorage.setItem('infra_user', JSON.stringify({ id: id, ...user }));
            location.reload();
        } else {
            alert("Access Denied: ID not recognized.");
        }
    },

    launchRoleBasedUI: function(user) {
        document.getElementById('auth_layer').style.display = 'none';
        
        // --- THE RESTRICTION LOGIC ---
        if (user.role === "super_admin" || user.role === "admin") {
            AdminEngine.init(user.role === "super_admin");
        } else {
            // Field Staff ONLY see the survey form
            UIEngine.init(); 
        }
    },

    logout: function() {
        localStorage.clear();
        location.reload();
    }
};

window.App = AuthEngine;
