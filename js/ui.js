/**
 * INFRA DEPOT - ENTERPRISE UI ENGINE (PHASE 2)
 * Features: Prime Locations, Nested Materials & Brands
 */

const UIEngine = {
    selectedMaterials: {}, // Stores variety and brand selections

    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="card dashboard-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; background:var(--accent-glow); color:black; font-weight:bold; padding:15px; border-radius:15px;">
                    <div class="mis-stat"><small>TODAY</small><div id="stat_today">...</div></div>
                    <div class="mis-stat"><small>YEAR</small><div id="stat_year">...</div></div>
                </div>

                <div class="card">
                    <div class="section-label"><span>01</span> BUSINESS IDENTITY</div>
                    <input type="text" id="f_name" placeholder="Business Name">
                    <input type="text" id="o_name" placeholder="Owner Name">
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <input type="tel" id="o_mob" placeholder="Owner Mobile" oninput="UIEngine.syncWA('o')">
                        <input type="tel" id="o_wa" placeholder="WhatsApp">
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>02</span> SUPPLY AREA (UDAIPUR)</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px;">
                        <label class="check-box"><input type="checkbox" id="area_full"> Whole Udaipur</label>
                        <label class="check-box"><input type="checkbox" id="area_radius"> 25km Radius</label>
                    </div>
                    <small style="color:var(--accent-glow)">TOP 50 PRIME LOCATIONS</small>
                    <div id="location_grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; height:150px; overflow-y:auto; background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; margin-top:5px; border:1px solid var(--glass-border);">
                        </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>03</span> MATERIAL & BRAND SELECTION</div>
                    <div id="material_container">
                        ${['Sand', 'Aggregates', 'Masonry Stone', 'TMT Steel', 'Cement', 'Bricks'].map(m => `
                            <div class="material-block" style="margin-bottom:10px;">
                                <label class="check-box" style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; display:block;">
                                    <input type="checkbox" onchange="UIEngine.toggleMaterial('${m}', this.checked)"> <b>${m}</b>
                                </label>
                                <div id="nested_${m.replace(' ', '_')}" style="display:none; padding-left:20px; margin-top:10px;"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>04</span> PHOTOS (MAX 10)</div>
                    <div id="photo_preview_grid" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:5px; margin-bottom:10px;"></div>
                    <button class="btn-main" style="background:#34495e;" onclick="document.getElementById('photo_input').click()">📸 ADD LIVE PHOTO</button>
                    <input type="file" id="photo_input" accept="image/*" capture="camera" multiple style="display:none;" onchange="UIEngine.handlePhotos(this)">
                </div>

                <div class="card">
                    <div class="section-label"><span>05</span> FLEET SIZE</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        ${['Tractor', 'Mini Truck', 'Truck', 'Dumper', 'Mini Dumper', 'Trailer'].map(f => this.renderFleet(f, 'fl_' + f.toLowerCase().replace(' ', ''))).join('')}
                    </div>
                </div>

                <button id="sync_btn" class="btn-main btn-green" onclick="window.SupplierEngine.syncToCloud()">🚀 FINAL SUBMISSION</button>
            </div>
        `;

        this.injectLocations();
        setTimeout(() => {
            MapEngine.init();
            SupplierEngine.loadDashboardStats();
        }, 600);
    },

    injectLocations: function() {
        const locs = ['Hiran Magri', 'Fatehsagar', 'Sector 14', 'Sukher', 'Bhuwana', 'Panchwati', 'Mulla Talai', 'Goverdhan Vilas', 'Pratap Nagar', 'Savina', 'Shobhagpura', 'Debari', 'Udaisagar', 'Bedla', 'Badi', 'Rampura', 'Titardi', 'Kaladwas', 'Madri', 'Surajpole'];
        const grid = document.getElementById('location_grid');
        grid.innerHTML = locs.map(l => `<label style="font-size:11px;"><input type="checkbox" class="loc-check" value="${l}"> ${l}</label>`).join('');
    },

    toggleMaterial: function(m, checked) {
        const container = document.getElementById(`nested_${m.replace(' ', '_')}`);
        if (!checked) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';
        
        // Example Varieties for demo (We can add all 10 later)
        const varieties = m === 'Cement' ? ['OPC 43', 'OPC 53', 'PPC'] : ['Premium', 'Standard', 'Local'];
        const brands = ['Ambuja', 'Ultratech', 'JK Lakshmi', 'Wonder', 'Binani'];

        container.innerHTML = `
            <small style="color:var(--accent-glow)">Varieties:</small>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-top:5px;">
                ${varieties.map(v => `<label style="font-size:11px;"><input type="checkbox" value="${v}"> ${v}</label>`).join('')}
            </div>
            <small style="color:var(--accent-glow); margin-top:10px; display:block;">Brands:</small>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-top:5px;">
                ${brands.map(b => `<label style="font-size:11px;"><input type="checkbox" value="${b}"> ${b}</label>`).join('')}
            </div>
        `;
    },

    syncWA: function(type) {
        document.getElementById(type + '_wa').value = document.getElementById(type + '_mob').value;
    },

    renderFleet: function(name, id) {
        return `<div class="counter-box" style="padding:10px;"><small>${name}</small><br><div style="display:flex; justify-content:center; align-items:center; gap:10px;"><button class="btn-circle" onclick="UIEngine.step('${id}',-1)">-</button><b id="${id}">0</b><button class="btn-circle" onclick="UIEngine.step('${id}',1)">+</button></div></div>`;
    },

    step: function(id, val) {
        let el = document.getElementById(id);
        let cur = parseInt(el.innerText);
        if(cur + val >= 0 && cur + val <= 20) el.innerText = cur + val;
    },

    photos: [],
    handlePhotos: function(input) {
        Array.from(input.files).forEach(file => {
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
        document.getElementById('photo_preview_grid').innerHTML = this.photos.map((src, i) => `
            <div style="position:relative; width:100%; padding-top:100%; background:url(${src}) center/cover; border-radius:4px; border:1px solid var(--accent-glow);">
                <div onclick="UIEngine.removePhoto(${i})" style="position:absolute; top:-5px; right:-5px; background:red; color:white; width:18px; height:18px; font-size:12px; text-align:center; border-radius:50%; cursor:pointer; line-height:18px;">×</div>
            </div>
        `).join('');
    },

    removePhoto: function(i) { this.photos.splice(i, 1); this.renderPhotoGrid(); }
};
window.UIEngine = UIEngine;
