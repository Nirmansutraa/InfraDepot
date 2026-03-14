const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav" style="display:flex; justify-content:space-between; align-items:center; padding-bottom:15px;">
                    <div><small>STAFF</small><br><b style="color:var(--accent-glow)">${localStorage.getItem('infra_session') || 'FS-001'}</b></div>
                    <button class="btn-circle" style="background:#e74c3c" onclick="App.logout()">×</button>
                </div>

                <div class="card">
                    <div class="section-label"><span>01</span> LOCATION & MAP</div>
                    <div id="map_display" style="width:100%; height:200px; border-radius:16px; margin-bottom:12px; background:#111; border:1px solid var(--glass-border);"></div>
                    <input type="text" id="form_coords" placeholder="Coordinates" readonly>
                    <button class="btn-main btn-gray" style="margin-top:10px;" onclick="MapEngine.captureGPS()">📍 CAPTURE GPS</button>
                    <textarea id="form_address" placeholder="Address..." style="margin-top:10px;"></textarea>
                </div>

                <div class="card">
                    <div class="section-label"><span>02</span> SUPPLIER ENTITY</div>
                    <label>FIRM NAME</label>
                    <input type="text" placeholder="Enter Firm Name">
                    <label style="margin-top:10px; display:block;">MOBILE</label>
                    <input type="tel" placeholder="+91">
                </div>

                <div class="card">
                    <div class="section-label"><span>03</span> LOGISTICS</div>
                    <div class="counter-box"><span>Mini Truck</span><div style="display:flex;gap:15px;"><button class="btn-circle" onclick="UIEngine.step('c1',-1)">-</button><b id="c1">0</b><button class="btn-circle" onclick="UIEngine.step('c1',1)">+</button></div></div>
                    <div class="counter-box"><span>Dumper</span><div style="display:flex;gap:15px;"><button class="btn-circle" onclick="UIEngine.step('c2',-1)">-</button><b id="c2">0</b><button class="btn-circle" onclick="UIEngine.step('c2',1)">+</button></div></div>
                </div>

                <div class="footer-actions">
                    <button id="sync_btn" class="btn-main btn-green" onclick="window.SupplierEngine.syncToCloud()">🚀 SYNC TO CLOUD</button>
                </div>
            </div>
        `;

        setTimeout(() => MapEngine.init(), 600);
    },

    step: function(id, val) {
        let el = document.getElementById(id);
        let current = parseInt(el.innerText);
        el.innerText = Math.max(0, current + val);
    }
};
window.UIEngine = UIEngine;
