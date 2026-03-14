/**
 * INFRA DEPOT - AUTH ENGINE v5.3 (SECURE LOGIN)
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
                    <input type="text" id="login_id" placeholder="Staff ID (e.g. FS123456)">
                    <input type="password" id="login_pass" placeholder="Password">
                    <button class="btn-main btn-green" onclick="AuthEngine.handleLogin()">🔓 SECURE LOGIN</button>
                </div>
            </div>
        `;
    },

    handleLogin: async function() {
        const id = document.getElementById('login_id').value.trim();
        const pass = document.getElementById('login_pass').value.trim();

        if (!id || !pass) return alert("Enter ID and Password");

        try {
            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const userSnap = await getDoc(doc(window.db, "users", id));

            if (userSnap.exists()) {
                const userData = userSnap.data();
                
                // Check if password matches
                if (userData.password === pass) {
                    localStorage.setItem('infra_user', JSON.stringify({ id: id, ...userData }));
                    location.reload();
                } else {
                    alert("Incorrect Password!");
                }
            } else {
                alert("Staff ID not found!");
            }
        } catch (e) { alert("Connection Error"); }
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
