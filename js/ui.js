const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';
        
        // Ensure Leaflet is loaded for maps
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav" style="display:flex; justify-content:space-between; align-items:center; padding-bottom:15px;">
                    <div><small style="color:var(--text-secondary)">LOGGED IN AS</small><br><b style="color:var(--accent-glow)">${localStorage.getItem('infra_session')}</b></div>
                    <button class="btn-circle" style="background:#e74c3c" onclick="App.logout()">×</button>
                </div>

                <div class="card">
                    <div class="section-label"><span>01</span> LOCATION & MAP</div>
                    <div id="map_display" style="width:100%; height:180px; border-radius:16px; margin-bottom:12px; background:#111;"></div>
                    <input type="text" id="form_coords" placeholder="Capture Coordinates" readonly>
                    <button class="btn-main btn-gray" style="margin-top:10px;" onclick="MapEngine.captureGPS()">📍 CAPTURE GPS</button>
                    <textarea id="form_address" placeholder="Address auto-fill..." style="margin-top:10px;"></textarea>
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

        setTimeout(() => MapEngine.init(), 100);
    },

    step: function(id, val) {
        let el = document.getElementById(id);
        let current = parseInt(el.innerText);
        el.innerText = Math.max(0, current + val);
    }
};
