/**
 * INFRA DEPOT - DYNAMIC CLOUD AUTH 2026
 */
const AuthEngine = {
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
                <div class="card" style="margin-top:40px;">
                    <input type="text" id="login_id" placeholder="Enter Staff ID">
                    <button class="btn-main btn-green" onclick="AuthEngine.handleLogin()">SECURE LOGIN</button>
                </div>
            </div>
        `;
    },

    handleLogin: async function() {
        const id = document.getElementById('login_id').value.trim();
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        
        // Look for user in Firebase
        const userRef = doc(window.db, "users", id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            localStorage.setItem('infra_user', JSON.stringify({ id: id, ...userData }));
            location.reload();
        } else {
            alert("Unauthorized ID. Please contact Super Admin.");
        }
    },

    launchRoleBasedUI: function(user) {
        document.getElementById('auth_layer').style.display = 'none';
        if (user.role === "super_admin" || user.role === "admin") {
            AdminEngine.init(user.role === "super_admin");
        } else {
            UIEngine.init();
        }
    },

    logout: function() {
        localStorage.clear();
        location.reload();
    }
};
window.App = AuthEngine;
