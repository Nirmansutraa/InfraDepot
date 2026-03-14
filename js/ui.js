/**
 * INFRA DEPOT - ENTERPRISE UI ENGINE 2026
 * Features: Dashboard, 50 Locations, Material Varieties, 512KB Compression
 */

const UIEngine = {
    // 00 PROJECT DATA LIBRARIES
    photos: [],
    // Full list of 50 Udaipur Prime Locations
    locations: [
        "Hiran Magri", "Fatehsagar", "Sukher", "Bhuwana", "Panchwati", "Mulla Talai", "Goverdhan Vilas", "Pratap Nagar", "Savina", "Shobhagpura", "Debari", "Udaisagar", "Bedla", "Badi", "Rampura", "Titardi", "Kaladwas", "Madri", "Surajpole", "Delhi Gate", "City Station", "Ayad", "Pulla", "Sobhagpura", "New Bhupalpura", "Old Bhupalpura", "Shastri Circle", "University Road", "Thokar Chouraha", "Ganapati Nagar", "Transport Nagar", "Balicha", "Kaya", "Bari", "Lakhawali", "Kavita", "Amberi", "Bhuwana Bypass", "Loyra", "Zinc Smelter", "Chitrakoot Nagar", "Navratna Complex", "Mahaveer Nagar", "Keshav Nagar", "Sajjan Nagar", "Mallatalai", "Rani Road", "Fatehpura", "Bedwas", "Gajrapole"
    ],
    // 10-Variety/10-Brand Nested Data (Expand as needed)
    materials: {
        "Sand": { vars: ["River Sand", "M-Sand", "P-Sand", "Crushed Sand", "Plaster Sand"], brands: ["Local washed", "Premium M-Sand"] },
        "TMT Steel": { vars: ["8mm", "10mm", "12mm", "16mm", "Binding Wire"], brands: ["TATA Tiscon", "JSW Neo", "Jindal"] },
        "Cement": { vars: ["OPC 43", "OPC 53", "PPC", "White Cement"], brands: ["Ambuja", "Ultratech", "JK Lakshmi", "Wonder"] },
        // ... (Expand other materials similarly)
    },

    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="card dashboard-grid">
                    <div class="stat"><small>TODAY</small><div id="stat_today">...</div></div>
                    <div class="stat"><small>WEEK</small><div id="stat_week">...</div></div>
                    <div class="stat"><small>MONTH</small><div id="stat_month">...</div></div>
                    <div class="stat"><small>YEAR</small><div id="stat_year">...</div></div>
                </div>

                <div class="card">
                    <div class="section-label"><span>01</span> BUSINESS IDENTITY</div>
                    <input type="text" id="f_name" placeholder="Firm/Business Name">
                    <input type="text" id="o_name" placeholder="Owner Name">
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <input type="tel" id="o_mob" placeholder="Owner Mobile" oninput="UIEngine.syncWA('o')">
                        <input type="tel" id="o_wa" placeholder="WhatsApp">
                    </div>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <input type="tel" id="m_mob" placeholder="Manager Mobile" oninput="UIEngine.syncWA('m')">
                        <input type="tel" id="m_wa" placeholder="WhatsApp">
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>02</span> SUPPLY AREA (UDAIPUR)</div>
                    <div id="map_display" style="width:100%; height:140px; border-radius:10px; margin-bottom:10px;"></div>
                    <button class="btn-main btn-gray" onclick="MapEngine.captureGPS()">📍 CAPTURE GPS ADDRESS</button>
                    <textarea id="form_address" placeholder="Reverse Geo-coding..." readonly style="margin-top:10px; font-size:11px;"></textarea>
                    
                    <div style="margin: 15px 0; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <label class="check-box"><input type="checkbox" id="area_full" onchange="UIEngine.autoSelectAll(this.checked)"> Whole Udaipur</label>
                        <label class="check-box"><input type="checkbox" id="area_radius"> 25km Radius</label>
                    </div>
                    <div id="location_grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; height:120px; overflow-y:auto; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px;">
                        ${this.locations.map(l => `<label style="font-size:10px;"><input type="checkbox" class="loc-check" value="${l}"> ${l}</label>`).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>03</span> MATERIAL & BRANDS</div>
                    <div id="material_engine">
                        ${Object.keys(this.materials).map(m => `
                            <div class="material-block" style="border-bottom:1px solid #333; padding:10px 0;">
                                <label style="display:flex; justify-content:space-between; align-items:center;">
                                    <b>${m}</b>
                                    <input type="checkbox" class="mat-main-check" value="${m}" onchange="UIEngine.toggleMaterialSubmenu('${m}', this.checked)">
                                </label>
                                <div id="sub_${m.replace(' ', '')}" style="display:none; padding-left:15px; margin-top:10px;"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="section-label"><span>04</span> PHOTOS (MAX 10)</div>
                    <div id="photo_grid" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:5px; margin-bottom:10px;"></div>
                    <button class="btn-main" onclick="document.getElementById('p_in').click()">📸 ADD TAGGED PHOTO</button>
                    <input type="file" id="p_in" accept="image/*" capture="camera" multiple style="display:none;" onchange="UIEngine.compressAndAdd(this)">
                </div>

                <div class="card">
                    <div class="section-label"><span>05</span> FLEETSIZE</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        ${this.renderFleet('Tractor', 'fl_tractor')}
                        ${this.renderFleet('Mini Truck', 'fl_minitruck')}
                        ${this.renderFleet('Truck', 'fl_truck')}
                        ${this.renderFleet('Dumper', 'fl_dumper')}
                        ${this.renderFleet('Trailer', 'fl_trailer')}
                    </div>
                </div>

                <button id="sync_btn" class="btn-main btn-green" onclick="window.SupplierEngine.syncToCloud()">🚀 SUBMIT BUSINESS SURVEY</button>
            </div>
        `;

        setTimeout(() => { MapEngine.init(); SupplierEngine.loadDashboardStats(); }, 600);
    },

    // --- Enterprise Functions ---

    autoSelectAll: function(checked) {
        console.log("Whole Udaipur selection: " + checked);
        // Find ALL checkboxes that have the class '.loc-check'
        const allLocChecks = document.querySelectorAll('.loc-check');
        // Loop through them and set their state
        allLocChecks.forEach(el => {
            el.checked = checked;
        });
    },

    toggleMaterialSubmenu: function(m, checked) {
        const div = document.getElementById('sub_' + m.replace(' ', ''));
        if (!checked) { div.style.display = 'none'; return; }
        div.style.display = 'block';
        const data = this.materials[m];
        div.innerHTML = `
            <small style="color:var(--accent-glow)">Varieties:</small>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                ${data.vars.map(v => `<label style="font-size:10px;"><input type="checkbox" class="v-check" data-mat="${m}" value="${v}"> ${v}</label>`).join('')}
            </div>
            <small style="color:var(--accent-glow); margin-top:10px; display:block;">Brands:</small>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                ${data.brands.map(b => `<label style="font-size:10px;"><input type="checkbox" class="b-check" data-mat="${m}" value="${b}"> ${b}</label>`).join('')}
            </div>
        `;
    },

    syncWA: function(t) { document.getElementById(t + '_wa').value = document.getElementById(t + '_mob').value; },

    renderFleet: function(name, id) {
        return `<div class="counter-box" style="padding:10px;"><small>${name}</small><br><div style="display:flex; justify-content:center; align-items:center; gap:8px;"><button onclick="UIEngine.step('${id}',-1)">-</button><b id="${id}">0</b><button onclick="UIEngine.step('${id}',1)">+</button></div></div>`;
    },

    step: function(id, val) {
        let b = document.getElementById(id);
        let c = parseInt(b.innerText);
        if (c + val >= 0 && c + val <= 20) b.innerText = c + val;
    },

    // Photo Compression (Canvas engine)
    compressAndAdd: function(input) {
        const files = Array.from(input.files);
        files.forEach(file => {
            if (this.photos.length >= 10) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width, height = img.height;
                    const maxSize = 800; // Limits image resolution
                    if (width > height) { if (width > maxSize) { height *= maxSize / width; width = maxSize; } }
                    else { if (height > maxSize) { width *= maxSize / height; height = maxSize; } }
                    canvas.width = width; canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // 60% quality = ~100-300KB
                    this.photos.push(dataUrl);
                    this.renderPhotoGrid();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    },

    renderPhotoGrid: function() {
        document.getElementById('photo_grid').innerHTML = this.photos.map((src, i) => `<div style="position:relative; width:100%; padding-top:100%; background:url(${src}) center/cover; border-radius:4px;"><div onclick="UIEngine.removePhoto(${i})" style="position:absolute; top:0; right:0; background:red; color:white; width:16px; height:16px; font-size:12px; border-radius:50%; text-align:center; cursor:pointer;">×</div></div>`).join('');
    },

    removePhoto: function(i) { this.photos.splice(i, 1); this.renderPhotoGrid(); }
};
window.UIEngine = UIEngine;
