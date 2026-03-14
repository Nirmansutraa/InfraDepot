/**
 * INFRA DEPOT - AUTHENTICATION ENGINE
 * Managed by CTO/CDO Team
 */

const AuthEngine = {
    // This function creates the login HTML and puts it into the auth_layer
    renderLogin: function() {
        const authLayer = document.getElementById('auth_layer');
        const appLayer = document.getElementById('app_layer');

        // Hide the app, show the login
        appLayer.style.display = 'none';
        authLayer.style.display = 'block';

        authLayer.innerHTML = `
            <div class="container" style="padding-top: 50px;">
                <div class="card" style="text-align: center;">
                    <h2 style="color: var(--accent-orange);">InfraDepot Login</h2>
                    <p style="font-size: 12px; color: #666;">Enter your Field Staff Credentials</p>
                    
                    <div class="input-group" style="text-align: left;">
                        <label>EMAIL / STAFF ID</label>
                        <input type="text" id="login_email" placeholder="staff@infradepot.com">
                    </div>

                    <div class="input-group" style="text-align: left;">
                        <label>PASSWORD</label>
                        <input type="password" id="login_password" 
                               style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
                    </div>

                    <button class="btn-main btn-green" id="btn_login" style="width: 100%; margin-top: 10px;">
                        ACCESS PLATFORM
                    </button>
                    
                    <p id="auth_error" style="color: red; font-size: 12px; margin-top: 10px; display: none;">
                        Invalid credentials. Please try again.
                    </p>
                </div>
            </div>
        `;

        // Add Click Listener
        document.getElementById('btn_login').addEventListener('click', this.handleLogin);
    },

    handleLogin: function() {
        const email = document.getElementById('login_email').value;
        const pass = document.getElementById('login_password').value;

        // FOR NOW: Simple check so you can see the app
        // We will connect this to Firebase Auth in the next step
        if (email !== "" && pass !== "") {
            console.log("Login Successful");
            AuthEngine.showApp();
        } else {
            document.getElementById('auth_error').style.display = 'block';
        }
    },

    showApp: function() {
        document.getElementById('auth_layer').style.display = 'none';
        document.getElementById('app_layer').style.display = 'block';
        
        // Tell the UI engine to load the Survey
        if (typeof UIEngine !== 'undefined') {
            UIEngine.init();
        }
    }
};

// Start the Auth process when the page loads
window.addEventListener('DOMContentLoaded', () => {
    AuthEngine.renderLogin();
});
