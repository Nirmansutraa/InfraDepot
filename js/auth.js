/**
 * INFRA DEPOT - IDENTITY & ROLE ENGINE 2026
 */

const AuthEngine = {
    // 🛡️ Master User Database (Simulated for this stage)
    users: {
        "vijay_master": { role: "super_admin", name: "Vijay (Owner)" },
        "admin_01": { role: "admin", name: "Project Manager" },
        "FS-001": { role: "field_staff", name: "Field Surveyor 1" }
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
                <p>Intelligence & Logistics Core</p>
                <div class="card" style="margin-top:40px;">
                    <input type="text" id="login_id" placeholder="Enter Staff/Admin ID">
                    <button class="btn-main btn-green" onclick="AuthEngine.handleLogin()">🔓 SECURE LOGIN</button>
                    <p style="font-size:11px; margin-top:15px; opacity:0.6;">March 2026 Biometric Handshake Enabled</p>
                </div>
            </div>
        `;
    },

    handleLogin: function() {
        const id = document.getElementById('login_id').value;
        const user = this.users[id];

        if (user) {
            const sessionData = { id: id, ...user };
            localStorage.setItem('infra_user', JSON.stringify(sessionData));
            alert(`Welcome back, ${user.name}`);
            location.reload();
        } else {
            alert("Unauthorized ID. Access Denied.");
        }
    },

    launchRoleBasedUI: function(user) {
        document.getElementById('auth_layer').style.display = 'none';
        
        // Router: Decides what the user sees
        if (user.role === "super_admin") {
            AdminEngine.init(true); // Launch Admin Panel with Master rights
        } else if (user.role === "admin") {
            AdminEngine.init(false); // Launch Admin Panel with view rights
        } else {
            UIEngine.init(); // Launch Survey App for field staff
        }
    },

    logout: function() {
        localStorage.clear();
        location.reload();
    }
};

window.App = AuthEngine; // Bridge for logout button
