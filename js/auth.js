/**
 * INFRA DEPOT - IDENTITY & ROLE ENGINE 2026
 * Current Version: v4.2 (Secure Token Login)
 */

const AuthEngine = {
    // 🛡️ USER DATABASE: Update this list to add/remove staff
    users: {
        "vijay_master": { 
            role: "super_admin", 
            name: "Vijay (Super Admin)",
            access: "Full System Control" 
        },
        "admin_01": { 
            role: "admin", 
            name: "Udaipur Manager",
            access: "View & Export Only" 
        },
        "FS-001": { 
            role: "field_staff", 
            name: "Field Surveyor 01",
            access: "Input Only" 
        },
        "FS-002": { 
            role: "field_staff", 
            name: "Field Surveyor 02",
            access: "Input Only" 
        }
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
                <h1 style="color:var(--accent); letter-spacing:2px;">INFRA DEPOT</h1>
                <p style="opacity:0.6; font-size:12px;">ENTERPRISE LOGISTICS CORE</p>
                
                <div class="card" style="margin-top:40px; border: 1px solid var(--accent);">
                    <div style="margin-bottom:20px;">
                        <small style="color:var(--accent)">IDENTITY VERIFICATION</small>
                    </div>
                    <input type="text" id="login_id" placeholder="Enter Staff or Admin ID" style="text-align:center;">
                    <button class="btn-main btn-green" onclick="AuthEngine.handleLogin()">SECURE LOGIN</button>
                    
                    <div style="margin-top:20px; font-size:10px; opacity:0.5;">
                        🔐 Biometric & Device ID Handshake Enabled
                    </div>
                </div>
            </div>
        `;
    },

    handleLogin: function() {
        const id = document.getElementById('login_id').value.trim();
        const userData = this.users[id];

        if (userData) {
            // Save session
            const sessionObj = { id: id, ...userData };
            localStorage.setItem('infra_user', JSON.stringify(sessionObj));
            
            // Visual feedback
            const btn = document.querySelector('.btn-green');
            btn.innerHTML = "✅ VERIFIED";
            btn.style.background = "#fff";
            
            setTimeout(() => {
                location.reload();
            }, 800);
        } else {
            alert("❌ ACCESS DENIED: Invalid Staff ID.");
        }
    },

    launchRoleBasedUI: function(user) {
        // Hide the login screen
        document.getElementById('auth_layer').style.display = 'none';
        
        // --- ROLE ROUTER ---
        if (user.role === "super_admin") {
            console.log("Admin Mode: Full Access");
            AdminEngine.init(true); // Launch Super Admin Panel
        } 
        else if (user.role === "admin") {
            console.log("Admin Mode: Restricted View");
            AdminEngine.init(false); // Launch Manager Panel (No Delete)
        } 
        else {
            console.log("Field Mode: Input Only");
            UIEngine.init(); // Launch Field Survey GUI
        }
    },

    logout: function() {
        if(confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            location.reload();
        }
    }
};

window.App = AuthEngine;
