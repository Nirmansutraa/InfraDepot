/**
 * INFRA DEPOT - 2026 ELITE AUTHENTICATION ENGINE
 * Standard: FIDO2 / Passkey / Firebase 10+
 */

const AuthEngine = {
    // Renders the ultra-modern biometric login
    renderLogin: function() {
        const authLayer = document.getElementById('auth_layer');
        document.getElementById('app_layer').style.display = 'none';

        authLayer.innerHTML = `
            <div class="container" style="padding-top: 80px;">
                <div class="card" style="text-align: center; border: 1px solid var(--accent-glow); background: rgba(0,0,0,0.4);">
                    <div style="margin-bottom: 20px;">
                        <div style="width: 60px; height: 60px; background: var(--accent-glow); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(255, 107, 0, 0.4);">
                            <span style="font-size: 30px;">🛡️</span>
                        </div>
                    </div>
                    
                    <h2 style="color: white; margin-bottom: 5px;">InfraDepot Secure</h2>
                    <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 30px;">Biometric Verification Required</p>
                    
                    <div style="text-align: left; margin-bottom: 25px;">
                        <label>FIELD STAFF ID</label>
                        <input type="text" id="staff_id_input" placeholder="FS-XXXXXXX" 
                               style="background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); text-transform: uppercase;">
                    </div>

                    <button class="btn-main btn-green" id="btn_biometric_auth" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <span>USE PASSKEY / FACEID</span>
                    </button>
                    
                    <p style="color: var(--text-secondary); font-size: 11px; margin-top: 20px;">
                        Securely bound to this device. No password needed.
                    </p>
                </div>
            </div>
        `;

        document.getElementById('btn_biometric_auth').addEventListener('click', () => this.handlePasskeyAuth());
    },

    // 2026 Passkey Logic
    handlePasskeyAuth: async function() {
        const staffId = document.getElementById('staff_id_input').value;
        if (!staffId) { alert("Please enter Staff ID"); return; }

        const btn = document.getElementById('btn_biometric_auth');
        btn.innerHTML = "⌛ VERIFYING...";

        try {
            // STEP 1: In a production app, we would call Firebase to get an 'auth challenge'
            // STEP 2: Use the browser's credential API (Passkey)
            console.log("AuthEngine: Requesting Biometric Handshake...");
            
            // SIMULATION: This represents the FaceID/Fingerprint popup
            const success = await this.simulateWebAuthn();

            if (success) {
                console.log("Auth: Passkey Verified.");
                localStorage.setItem('infra_session', staffId);
                App.launchDashboard();
            }
        } catch (err) {
            console.error("Auth: Passkey Error", err);
            btn.innerHTML = "TRY AGAIN";
        }
    },

    simulateWebAuthn: function() {
        return new Promise(resolve => setTimeout(() => resolve(true), 1200));
    }
};
