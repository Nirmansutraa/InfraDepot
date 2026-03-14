const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="top-nav">
                    <div><small>LOGGED IN</small><br><b style="color:var(--accent-glow)">${localStorage.getItem('infra_session') || 'FS-001'}</b></div>
                    <button class="btn-circle" style="background:#e74c3c" onclick="App.logout()">×</button>
                </div>

                <div class="card">
                    <div class="section-label"><span>01</span> LOCATION</div>
                    <div id="map_display" style="width:100%; height:180px; border-radius:12px; margin-bottom:10px; background:#111;"></div>
                    <button class="btn-main btn-gray" onclick="MapEngine.captureGPS()">📍 CAPTURE GPS</button>
                    <input type="hidden" id="form_coords">
                    <textarea id="form_address" placeholder="Address..." style="margin-top:10px; font-size:12px;"></textarea>
                </div>

                <div class="card">
                    <div class="section-label"><span>02</span> SUPPLIER</div>
                    <input type="text" placeholder="Enter Firm Name">
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <div class="counter-box" style="flex:1;"><span>Mini</span><br><b id="c1">0</b><div style="margin-top:5px;"><button onclick="UIEngine.step('c1',-1)">-</button><button onclick="UIEngine.step('c1',1)">+</button></div></div>
                        <div class="counter-box" style="flex:1;"><span>Dumper</span><br><b id="c2">0</b><div style="margin-top:5px;"><button onclick="UIEngine.step('c2',-1)">-</button><button onclick="UIEngine.step('c2',1)">+</button></div></div>
                    </div>
                </div>

                <button id="sync_btn" class="btn-main btn-green" onclick="window.SupplierEngine.syncToCloud()">🚀 SYNC TO CLOUD</button>

                <div class="card" style="margin-top:20px; border-top: 2px solid var(--accent-glow);">
                    <div class="section-label">RECENT SUBMISSIONS</div>
                    <div id="history_list" style="margin-top:10px;">Loading history...</div>
                </div>
            </div>
        `;

        setTimeout(() => {
            MapEngine.init();
            SupplierEngine.loadHistory(); // Pull history on startup
        }, 600);
    },

    step: function(id, val) {
        let el = document.getElementById(id);
        let current = parseInt(el.innerText);
        el.innerText = Math.max(0, current + val);
    }
};
window.UIEngine = UIEngine;
