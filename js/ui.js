/**
 * INFRA DEPOT - MOBILE OPTIMIZED UI 2026
 */

const UIEngine = {
    photos: [],
    materials: {
        "Sand": { vars: ["River Sand", "M-Sand", "P-Sand"], brands: ["Local", "Washed"] },
        "Aggregates": { vars: ["10mm", "20mm", "40mm"], brands: ["Blue Metal", "Black Stone"] },
        "Masonry Stone": { vars: ["Khanda", "Gittli"], brands: ["Local"] },
        "TMT Steel": { vars: ["8mm", "10mm", "12mm"], brands: ["TATA", "JSW", "Jindal"] },
        "Cement": { vars: ["OPC 43", "OPC 53", "PPC"], brands: ["Ambuja", "Ultratech", "Wonder"] },
        "Bricks": { vars: ["Red Clay", "Fly Ash", "AAC"], brands: ["Local Kiln"] }
    },

    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="container">
                <div class="dashboard-grid">
                    <div class="stat"><small>Today</small><div id="stat_today">0</div></div>
                    <div class="stat"><small>Week</small><div id="stat_week">0</div></div>
                    <div class="stat"><small>Month</small><div id="stat_month">0</div></div>
                    <div class="stat"><small>Year</small><div id="stat_year">0</div></div>
                </div>

                <div class="card">
                    <div class="section-label">📋 BUSINESS DETAILS</div>
                    <input type="text" id="f_name" placeholder="Firm Name (required)">
                    <input type="text" id="o_name" placeholder="Owner Name">
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <input type="tel" id="o_mob" placeholder="Owner Mobile" oninput="UIEngine.syncWA('o')">
                        <input type="tel" id="o_wa" placeholder="WhatsApp">
                    </div>
                </div>

                <div class="card">
                    <div class="section-label">📍 LOCATION VERIFICATION</div>
                    <div id="map_display" style="width:100%; height:160px; border-radius:12px; margin-bottom:12px; background:#000;"></div>
                    <button class="btn-main btn-gray" onclick="MapEngine.captureGPS()">📡 CAPTURE CURRENT LOCATION</button>
                    <textarea id="form_address" placeholder="Address will appear here..." readonly style="margin-top:10px; height:60px;"></textarea>
                    
                    <div style="margin-top:15px;">
                        <label class="check-box"><input type="checkbox" id="area_full"> Supply: Whole Udaipur</label>
                        <label class="check-box"><input type="checkbox" id="area_radius"> Supply: 25km Radius</label>
                    </div>
                </div>

                <div class="card">
                    <div class="section-label">🏗️ MATERIALS & BRANDS</div>
                    ${Object.keys(this.materials).map(m => `
                        <div class="mat-row">
                            <label class="check-box" style="background:transparent; padding:0;">
                                <input type="checkbox" class="mat-main-check" value="${m}" onchange="UIEngine.toggleMat('${m}', this.checked)">
                                <b>${m}</b>
                            </label>
                            <div id="sub_${m.replace(' ', '')}" style="display:none; padding:15px; background:rgba(255,255,255,0.03); border-radius:10px; margin-top:10px;"></div>
                        </div>
                    `).join('')}
                </div>

                <div class="card">
                    <div class="section-label">🚛 LOGISTICS FLEET</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        ${['Tractor', 'Mini Truck', 'Truck', 'Dumper', 'Trailer'].map(f => this.renderFleet(f)).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="section-label">📸 PHOTO PROOF (MAX 10)</div>
                    <div id="photo_grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:12px;"></div>
                    <button class="btn-main btn-gray" onclick="document.getElementById('p_in').click()">📷 TAKE PHOTO</button>
                    <input type="file" id="p_in" accept="image/*" capture="camera" multiple style="display:none;" onchange="UIEngine.compressAndAdd(this)">
                </div>

                <button id="sync_btn" class="btn-main btn-green" style="position:sticky; bottom:15px; box-shadow:0 -5px 20px rgba(0,0,0,0.5);" onclick="window.SupplierEngine.syncToCloud()">🚀 FINISH & SYNC TO CLOUD</button>
            </div>
        `;

        setTimeout(() => { MapEngine.init(); SupplierEngine.loadDashboardStats(); }, 600);
    },

    toggleMat: function(m, show) {
        const div = document.getElementById('sub_' + m.replace(' ', ''));
        if (!show) { div.style.display = 'none'; return; }
        div.style.display = 'block';
        const d = this.materials[m];
        div.innerHTML = `
            <small style="color:var(--accent)">Types</small>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:10px;">
                ${d.vars.map(v => `<label style="font-size:12px;"><input type="checkbox" class="v-check" data-mat="${m}" value="${v}"> ${v}</label>`).join('')}
            </div>
            <small style="color:var(--accent)">Brands</small>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                ${d.brands.map(b => `<label style="font-size:12px;"><input type="checkbox" class="b-check" data-mat="${m}" value="${b}"> ${b}</label>`).join('')}
            </div>
        `;
    },

    syncWA: function(t) { document.getElementById(t+'_wa').value = document.getElementById(t+'_mob').value; },
    
    renderFleet: function(n) {
        const id = 'fl_' + n.toLowerCase().replace(' ', '');
        return `
            <div class="counter-box">
                <small>${n}</small>
                <div class="counter-controls">
                    <button class="btn-step" onclick="UIEngine.step('${id}',-1)">-</button>
                    <b id="${id}" style="font-size:18px;">0</b>
                    <button class="btn-step" onclick="UIEngine.step('${id}',1)">+</button>
                </div>
            </div>
        `;
    },

    step: function(id, v) {
        let b = document.getElementById(id);
        let c = parseInt(b.innerText);
        if (c + v >= 0 && c + v <= 20) b.innerText = c + v;
    },

    compressAndAdd: function(input) {
        Array.from(input.files).forEach(file => {
            if (this.photos.length >= 10) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width, h = img.height;
                    if (w > 800) { h *= 800 / w; w = 800; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    this.photos.push(canvas.toDataURL('image/jpeg', 0.6));
                    this.renderPhotoGrid();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    },

    renderPhotoGrid: function() {
        document.getElementById('photo_grid').innerHTML = this.photos.map((src, i) => `
            <div style="position:relative; width:100%; padding-top:100%; background:url(${src}) center/cover; border-radius:8px; border:1px solid var(--accent);">
                <div onclick="UIEngine.removePhoto(${i})" style="position:absolute; top:-5px; right:-5px; background:red; color:white; width:20px; height:20px; font-size:14px; border-radius:50%; text-align:center; cursor:pointer; line-height:20px;">×</div>
            </div>
        `).join('');
    },
    removePhoto: function(i) { this.photos.splice(i, 1); this.renderPhotoGrid(); }
};
window.UIEngine = UIEngine;
