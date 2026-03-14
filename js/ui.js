/**
 * INFRA DEPOT - ENTERPRISE UI ENGINE 2026
 * Features: MIS Dashboard, Smart WhatsApp Sync, Prime Locations
 */

const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="card dashboard-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; background:var(--accent-glow); color:black; font-weight:bold;">
                    <div class="mis-stat"><small>TODAY</small><div id="stat_today">0</div></div>
                    <div class="mis-stat"><small>WEEK</small><div id="stat_week">0</div></div>
                    <div class="mis-stat"><small>MONTH</small><div id="stat_month">0</div></div>
                    <div class="mis-stat"><small>YEAR</small><div id="stat_year">0</div></div>
                </div>

                <div class="card">
                    <div class="section-label"><span>01</span> BUSINESS IDENTITY</div>
                    <label>FIRM NAME</label>
                    <input type="text" id="f_name" placeholder="Business Name">
                    
                    <label>OWNER NAME</label>
                    <input type="text" id="o_name" placeholder="Owner Name">
                    
                    <div style="display:flex; gap:10px;">
                        <div style="flex:1;"><label>OWNER MOBILE</label><input type="tel" id="o_mob" placeholder="+91" oninput="UIEngine.syncWA('o')"></div>
                        <div style="flex:1;"><label>WHATSAPP</label><input type="tel" id="o_wa" placeholder="+91"></div>
                    </div>

                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <div style="flex:1;"><label>MANAGER MOBILE</label><input type="tel" id="m_mob" placeholder="+91" oninput="UIEngine.syncWA('m')"></div>
                        <div style="flex:1;"><label>WHATSAPP</label><input type="tel" id="m_wa" placeholder="+91"></div>
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>02</span> SUPPLY AREA (UDAIPUR)</div>
                    <div id="map_display" style="width:100%; height:150px; border-radius:12px; margin-bottom:10px;"></div>
                    <button class="btn-main btn-gray" onclick="MapEngine.captureGPS()">📍 VERIFY GPS & ADDRESS</button>
                    <textarea id="form_address" placeholder="Reverse Geo-coding..." readonly style="margin-top:10px; font-size:11px;"></textarea>
                    
                    <div style="margin-top:15px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <label class="check-box"><input type="checkbox" id="area_full"> Whole Udaipur</label>
                        <label class="check-box"><input type="checkbox" id="area_radius"> 25km Radius</label>
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>03</span> BUSINESS VERIFICATION (MAX 10)</div>
                    <div id="photo_preview_grid" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:5px; margin-bottom:10px;"></div>
                    <button class="btn-main" style="background:#34495e;" onclick="document.getElementById('photo_input').click()">📸 TAKE LIVE PHOTO</button>
                    <input type="file" id="photo_input" accept="image/*" capture="camera" multiple style="display:none;" onchange="UIEngine.handlePhotos(this)">
                </div>

                <div class="card">
                    <div class="section-label"><span>04</span> FLEET SIZE</div>
                    <div class="fleet-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        ${this.renderFleet('Tractor', 'fl_trac')}
                        ${this.renderFleet('Mini Truck', 'fl_mini')}
                        ${this.renderFleet('Truck', 'fl_truck')}
                        ${this.renderFleet('Dumper', 'fl_dump')}
                        ${this.renderFleet('Mini Dumper', 'fl_mdump')}
                        ${this.renderFleet('Trailer', 'fl_trail')}
                    </div>
                </div>

                <button id="sync_btn" class="btn-main btn-green" onclick="window.SupplierEngine.syncToCloud()">🚀 FINAL SUBMISSION</button>
            </div>
        `;

        setTimeout(() => {
            MapEngine.init();
            SupplierEngine.loadDashboardStats();
        }, 600);
    },

    syncWA: function(type) {
        const mob = document.getElementById(type + '_mob').value;
        document.getElementById(type + '_wa').value = mob;
    },

    renderFleet: function(name, id) {
        return `
            <div class="counter-box" style="padding:10px;">
                <small>${name}</small><br>
                <div style="display:flex; justify-content:center; align-items:center; gap:10px;">
                    <button class="btn-circle" onclick="UIEngine.step('${id}',-1)">-</button>
                    <b id="${id}">0</b>
                    <button class="btn-circle" onclick="UIEngine.step('${id}',1)">+</button>
                </div>
            </div>
        `;
    },

    step: function(id, val) {
        let el = document.getElementById(id);
        let current = parseInt(el.innerText);
        if(current + val >= 0 && current + val <= 20) el.innerText = current + val;
    },

    photos: [],
    handlePhotos: function(input) {
        const files = Array.from(input.files);
        files.forEach(file => {
            if(this.photos.length >= 10) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.photos.push(e.target.result);
                this.renderPhotoGrid();
            };
            reader.readAsDataURL(file);
        });
    },

    renderPhotoGrid: function() {
        const grid = document.getElementById('photo_preview_grid');
        grid.innerHTML = this.photos.map((src, index) => `
            <div style="position:relative; width:100%; padding-top:100%; background:url(${src}) center/cover; border-radius:4px;">
                <div onclick="UIEngine.removePhoto(${index})" style="position:absolute; top:0; right:0; background:red; color:white; width:15px; height:15px; font-size:10px; text-align:center; border-radius:50%; cursor:pointer;">×</div>
            </div>
        `).join('');
    },

    removePhoto: function(index) {
        this.photos.splice(index, 1);
        this.renderPhotoGrid();
    }
};
window.UIEngine = UIEngine;
