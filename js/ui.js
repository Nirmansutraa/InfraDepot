/**
 * INFRA DEPOT - 2026 NEXT-GEN UI ENGINE
 */

const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';
        
        appLayer.innerHTML = `
            <div class="container">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0 20px 0;">
                    <div>
                        <small style="color:var(--text-secondary); display:block;">Current Session</small>
                        <span style="font-weight:800; color:var(--accent-glow);">FS-3500197</span>
                    </div>
                    <button onclick="location.reload()" style="background:none; border:1px solid #e74c3c; color:#e74c3c; padding:5px 12px; border-radius:8px; font-size:12px;">EXIT</button>
                </div>

                <div class="card">
                    <div class="section-label"><span>01</span> TRACKING CORE</div>
                    <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:14px; text-align:center;">
                        <span style="font-family:monospace; font-size:28px; color:var(--success-neon); letter-spacing:4px;">ID-8829-X</span>
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>02</span> ENTITY DATA</div>
                    <label>FIRM NAME</label>
                    <input type="text" placeholder="Start typing name...">
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:15px;">
                        <div>
                            <label>MOBILE</label>
                            <input type="tel" placeholder="+91">
                        </div>
                        <div>
                            <label>WHATSAPP</label>
                            <input type="tel" placeholder="+91">
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>03</span> MATERIALS INTELLIGENCE</div>
                    <div class="material-grid">
                        <div class="material-item"><input type="checkbox" style="transform:scale(1.5);"> <span>Sand</span></div>
                        <div class="material-item"><input type="checkbox" style="transform:scale(1.5);"> <span>Stone</span></div>
                        <div class="material-item"><input type="checkbox" style="transform:scale(1.5);"> <span>Cement</span></div>
                        <div class="material-item"><input type="checkbox" style="transform:scale(1.5);"> <span>Steel</span></div>
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>04</span> LOGISTICS FLEET</div>
                    <div class="counter-box">
                        <span>Mini Truck</span>
                        <div style="display:flex; align-items:center; gap:15px;">
                            <button class="btn-circle" onclick="UIEngine.step('c1', -1)">−</button>
                            <b id="c1" style="font-size:18px; width:20px; text-align:center;">0</b>
                            <button class="btn-circle" onclick="UIEngine.step('c1', 1)">+</button>
                        </div>
                    </div>
                    <div class="counter-box">
                        <span>Dumper</span>
                        <div style="display:flex; align-items:center; gap:15px;">
                            <button class="btn-circle" onclick="UIEngine.step('c2', -1)">−</button>
                            <b id="c2" style="font-size:18px; width:20px; text-align:center;">0</b>
                            <button class="btn-circle" onclick="UIEngine.step('c2', 1)">+</button>
                        </div>
                    </div>
                </div>

                <div class="footer-actions">
                    <button class="btn-main btn-gray">SAVE DRAFT</button>
                    <button class="btn-main btn-green" onclick="UIEngine.sync()">SYNC TO CLOUD</button>
                </div>
            </div>
        `;
    },

    step: function(id, val) {
        let el = document.getElementById(id);
        let current = parseInt(el.innerText);
        current = Math.max(0, current + val);
        el.innerText = current;
    },

    sync: function() {
        alert("Pushing to InfraDepot Cloud...");
    }
};
