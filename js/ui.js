const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';
        
        // Inject Leaflet CSS for mapping
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
                    <div><small>STAFF</small><br><b style="color:var(--accent-glow)">FS-3500197</b></div>
                    <button class="btn-circle" style="background:#e74c3c" onclick="location.reload()">×</button>
                </div>

                <div class="card">
                    <div class="section-label"><span>03</span> LIVE VERIFICATION</div>
                    <div id="map_display" style="width:100%; height:180px; border-radius:16px; margin-bottom:12px; background:#111; border:1px solid var(--glass-border);"></div>
                    
                    <label>COORDINATES</label>
                    <input type="text" id="form_coords" placeholder="Waiting for capture..." readonly>
                    
                    <button class="btn-main btn-green" style="margin-top:10px;" onclick="MapEngine.captureGPS()">
                        📍 UPDATE CURRENT LOCATION
                    </button>
                    
                    <label style="margin-top:15px; display:block;">VERIFIED ADDRESS</label>
                    <textarea id="form_address" placeholder="Address will auto-fill..."></textarea>
                </div>

                <div class="footer-actions">
                    <button class="btn-main btn-gray">SAVE LOCAL</button>
                    <button class="btn-main btn-green">SYNC CLOUD</button>
                </div>
            </div>
        `;

        // Initialize Map after the HTML is added
        setTimeout(() => MapEngine.init(), 100);
    }
};
