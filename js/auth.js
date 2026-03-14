/**
 * INFRA DEPOT - AUTH ENGINE v1.1
 */
export const AuthEngine = {
    init: function() {
        console.log("Auth: Initializing Login Interface...");
        const authLayer = document.getElementById('auth_layer');
        const loader = document.getElementById('loader');

        // Hide loader and show auth layer immediately
        if (loader) loader.style.display = 'none';
        authLayer.style.display = 'flex';
        authLayer.className = 'auth-container'; 

        authLayer.innerHTML = `
            <div class="card" style="width:100%; max-width:320px; padding:30px; background:#111; border-radius:15px; text-align:center; border:1px solid #333;">
                <h2 style="color:var(--accent); margin-bottom:5px;">InfraDepot</h2>
                <p style="opacity:0.6; font-size:12px; margin-bottom:25px;">Enterprise Identity Management</p>
                
                <input type="text" id="login_id" placeholder="Staff ID (e.g. FS123456)" style="width:100%; padding:12px; margin-bottom:15px; background:#000; border:1px solid #333; color:#fff; border-radius:8px;">
                <input type="password" id="login_pass" placeholder="Password" style="width:100%; padding:12px; margin-bottom:20px; background:#000; border:1px solid #333; color:#fff; border-radius:8px;">
                
                <button onclick="AuthEngine.handleLogin()" style="width:100%; padding:12px; background:#2dd4bf; color:#000; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">LOGIN TO SYSTEM</button>
            </div>
        `;
    },

    handleLogin: async function() {
        const id = document.getElementById('login_id').value.trim();
        const pass = document.getElementById('login_pass').value.trim();

        if (!id || !pass) return alert("Enter credentials");

        try {
            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const userSnap = await getDoc(doc(window.db, "users", id));

            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (userData.password === pass) {
                    localStorage.setItem('infra_user', JSON.stringify({ id, ...userData }));
                    location.reload(); // Refresh to launch dashboard
                } else {
                    alert("Invalid Password");
                }
            } else {
                alert("User ID not found");
            }
        } catch (e) {
            console.error(e);
            alert("Connection Error");
        }
    },

    launchRoleBasedUI: function(user) {
        const loader = document.getElementById('loader');
        if (loader) loader.remove();

        if (user.role === 'admin' || user.id === 'vijay_master') {
            window.AdminEngine.init(true);
        } else {
            window.UIEngine.init(); // Field Staff UI
        }
    }
};

window.AuthEngine = AuthEngine;
