/**
 * INFRA DEPOT - AUTH ENGINE v1.4
 */
export const AuthEngine = {
    init: function() {
        console.log("Auth: Rendering Login Interface...");
        const viewport = document.getElementById('main_viewport') || document.getElementById('auth_layer');
        
        if (!viewport) return;

        viewport.innerHTML = `
            <div style="height:100vh; display:flex; justify-content:center; align-items:center; background:#f3f4f6;">
                <div class="card" style="width:100%; max-width:320px; padding:30px; text-align:center;">
                    <h2 style="color:#111827; margin-bottom:5px;">InfraDepot</h2>
                    <p style="color:#6b7280; font-size:12px; margin-bottom:25px;">Enterprise Identity Management</p>
                    
                    <input type="text" id="login_id" placeholder="Staff ID" style="border:1px solid #ddd; color:#000;">
                    <input type="password" id="login_pass" placeholder="Password" style="border:1px solid #ddd; color:#000;">
                    
                    <button id="login_btn" class="btn-main" style="background:#111827; color:#fff; margin-top:10px;">LOGIN TO SYSTEM</button>
                </div>
            </div>
        `;

        // Using a listener instead of onclick to avoid "undefined" errors
        document.getElementById('login_btn').addEventListener('click', () => this.handleLogin());
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
                    window.location.reload(); 
                } else {
                    alert("Invalid Password");
                }
            } else {
                alert("User ID not found");
            }
        } catch (e) {
            console.error(e);
            alert("Connection Error. Check Internet.");
        }
    }
};

window.AuthEngine = AuthEngine;
