/**
 * INFRA DEPOT - UI ENGINE 
 * Fix: Script Injection & Layout
 */

const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        // 1. Inject Leaflet Resources if missing
        this.injectDependencies();

        // 2. Build the UI
        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav" style="display:flex; justify-content:space-between; align-items:center; padding-bottom:15px;">
                    <div><small style="color:var(--text-secondary)">LOGGED IN AS</small><br><b style="color:var(--accent-glow)">${localStorage.getItem('infra_session') || 'FS-001'}</b></div>
                    <button class="btn-circle" style="background:#e74c3c" onclick="App.logout()">×</button>
                </div>

                <div class="card">
                    <div class="section-label"><span>01</span> LOCATION & MAP</div>
                    <div id="map_display" style="width:100%; height:200px; border-radius:16px; margin-bottom:12px; background:#111; border: 1px solid var(--glass-border);"></div>
                    
                    <label>COORDINATES</label>
                    <input type="text" id="form_coords" placeholder="Waiting for GPS..." readonly>
                    
                    <button class="btn-main btn-gray" style="margin-top:10px; border: 1px solid var(--accent-glow);" onclick="MapEngine.captureGPS()">
                        📍 CAPTURE GPS & ADDRESS
                    </button>
                    
                    <label style="margin-top:15px; display:block;">AUTO-FILLED ADDRESS</label>
                    <textarea id="form_address" placeholder="Address will appear here..." style="width:100%; border-radius:12px; padding:10px; background:rgba(0,0,0,0.2); color:white; border:1px solid var(--glass-border);"></textarea>
                </div>

                <div class="card">
                    <div class="section-label"><span>02</span> SUPPLIER ENTITY</div>
                    <label>FIRM NAME</label>
                    <input type="text" placeholder="Enter Firm Name">
                    <label style="margin-top:10px; display:block;">OWNER MOBILE</label>
                    <input type="tel" placeholder="+91">
                </div>

                <div class="card">
                    <div class="section-label"><span>03</span> MATERIALS</div>
                    <div class="material-grid">
                        <div class="material-item"><input type="checkbox"> <span>Sand</span></div>
                        <div class="material-item"><input type="checkbox"> <span>Stone</span></div>
                        <div class="material-item"><input type="checkbox"> <span>Cement</span></div>
                        <div class="material-item"><input type="checkbox"> <span>Steel</span></div>
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>04</span> LOGISTICS</div>
                    <div class="counter-box"><span>Mini Truck</span><div style="display:flex;gap:15px;"><button class="btn-circle" onclick="UIEngine.step('c1',-1)">-</button><b id="c1">0</b><button class="btn-circle" onclick="UIEngine.step('c1',1)">+</button></div></div>
                    <div class="counter-box"><span>Dumper</span><div style="display:flex;gap:15px;"><button class="btn-circle" onclick="UIEngine.step('c2',-1)">-</button><b id="c2">0</b><button class="btn-circle" onclick="UIEngine.step('c2',1)">+</button></div></div>
                </div>

                <div class="footer-actions">
                    <button class="btn-main btn-green" onclick="SupplierEngine.syncToCloud()">🚀 SYNC TO CLOUD</button>
                </div>
            </div>
        `;

        // 3. Start Map Engine
        setTimeout(() => MapEngine.init(), 500);
    },

    injectDependencies: function() {
        if (!document.getElementById('leaflet-css')) {
            const css = document.createElement('link');
            css.id = 'leaflet-css';
            css.rel = 'stylesheet';
            css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(css);

            const js = document.createElement('script');
            js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            document.head.appendChild(js);
        }
    },

    step: function(id, val) {
        let el = document.getElementById(id);
        let current = parseInt(el.innerText);
        el.innerText = Math.max(0, current + val);
    }
};
