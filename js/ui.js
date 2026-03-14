/**
 * INFRA DEPOT - ENTERPRISE UI (FIXED IDS)
 */

const UIEngine = {
    photos: [],
    locations: ["Hiran Magri", "Fatehsagar", "Sukher", "Bhuwana", "Panchwati", "Mulla Talai", "Goverdhan Vilas", "Pratap Nagar", "Savina", "Shobhagpura", "Debari", "Udaisagar", "Bedla", "Badi", "Rampura", "Titardi", "Kaladwas", "Madri", "Surajpole", "Delhi Gate", "City Station", "Ayad", "Pulla", "New Bhupalpura", "Old Bhupalpura", "Shastri Circle", "University Road", "Thokar Chouraha", "Ganapati Nagar", "Transport Nagar", "Balicha", "Kaya", "Bari", "Lakhawali", "Kavita", "Amberi", "Bhuwana Bypass", "Loyra", "Zinc Smelter", "Chitrakoot Nagar", "Navratna Complex", "Mahaveer Nagar", "Keshav Nagar", "Sajjan Nagar", "Mallatalai", "Rani Road", "Fatehpura", "Bedwas", "Gajrapole"],
    materials: {
        "Sand": { vars: ["River Sand", "M-Sand", "P-Sand", "Crushed Sand", "Plaster Sand"], brands: ["Local River", "Ultratech Build", "M-Sand Premium", "Deccan Sand", "RoboSand", "Fairmate", "Magicrete", "Asahi", "Weber", "Standard"] },
        "Aggregates": { vars: ["10mm", "20mm", "40mm", "60mm", "Grit"], brands: ["Blue Metal", "Black Trap", "Granite", "L&T", "Dilip Buildcon", "IRB", "Local Udaipur", "Rajsamand", "Bhilwara", "Kota"] },
        "Masonry Stone": { vars: ["Khanda", "Gittli", "Face Stone", "Rubble"], brands: ["Udaipur Local", "Badi Mine", "Sukher White", "Dholpur", "Jodhpur", "Bhilwara Black", "Rajsamand Marble", "Kesariyaji", "Quartzite", "Standard"] },
        "TMT Steel": { vars: ["8mm", "10mm", "12mm", "16mm", "Binding Wire"], brands: ["TATA Tiscon", "JSW Neo", "Jindal Panther", "Sail", "Vizag Steel", "Kamdhenu", "Rathi", "SRMB", "Electrosteel", "Amba Steel"] },
        "Cement": { vars: ["OPC 43", "OPC 53", "PPC", "White Cement"], brands: ["Ambuja", "Ultratech", "JK Lakshmi", "Wonder", "Binani", "Shree Cement", "ACC", "Sanghi", "Dalmia", "JK Super"] },
        "Bricks": { vars: ["Red Clay", "Fly Ash", "AAC Blocks", "Concrete Blocks"], brands: ["Local Kiln", "Standard Fly-Ash", "Magicrete AAC", "Biltech", "Siporex", "JK Smart", "Ecorex", "Renaissance", "Aerocon", "BuildMate"] }
    },

    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';
        appLayer.innerHTML = `
            <div class="container">
                <div class="dashboard-grid">
                    <div class="stat"><small>Today</small><div id="stat_today">0</div></div>
                    <div class="stat"><small>Year</small><div id="stat_year">0</div></div>
                </div>

                <div class="card">
                    <div class="section-label">📋 IDENTITY</div>
                    <input type="text" id="f_name" placeholder="Firm Name">
                    <input type="text" id="o_name" placeholder="Owner Name">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <input type="tel" id="o_mob" placeholder="Owner Mobile" oninput="UIEngine.syncWA('o')">
                        <input type="tel" id="o_wa" placeholder="WhatsApp">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                        <input type="tel" id="m_mob" placeholder="Manager Mobile" oninput="UIEngine.syncWA('m')">
                        <input type="tel" id="m_wa" placeholder="WhatsApp">
                    </div>
                </div>

                <div class="card">
                    <div class="section-label">📍 RADIUS & LOCATIONS</div>
                    <div id="map_display" style="width:100%; height:140px; border-radius:10px; margin-bottom:10px;"></div>
                    <button class="btn-main btn-gray" onclick="MapEngine.captureGPS()">📡 ACTIVATE GPS</button>
                    <input type="hidden" id="form_coords">
                    <textarea id="form_address" placeholder="Address..." readonly style="margin-top:10px; font-size:11px;"></textarea>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin:15px 0;">
                        <label class="check-box"><input type="checkbox" id="area_full" onchange="UIEngine.autoSelectAll(this.checked)"> Udaipur City</label>
                        <label class="check-box"><input type="checkbox" id="area_radius"> 25km Radius</label>
                    </div>
                    <div id="loc_scroller" style="height:100px; overflow-y:auto; background:rgba(0,0,0,0.2); padding:10px; border-radius:10px;">
                        ${this.locations.map(l => `<label style="display:block; font-size:11px;"><input type="checkbox" class="loc-check" value="${l}"> ${l}</label>`).join('')}
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
                            <div id="sub_${m.replace(' ', '')}" style="display:none; padding:15px; background:rgba(255,255,255,0.03); border-radius:12px; margin-top:10px;"></div>
                        </div>
                    `).join('')}
                </div>

                <div class="card">
                    <div class="section-label">🚛 FLEET (0-20)</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        ${['Tractor', 'Mini Truck', 'Truck', 'Dumper', 'Trailer'].map(f => this.renderFleet(f)).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="section-label">📸 GEOTAGGED PHOTOS</div>
                    <div id="photo_grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:12px;"></div>
                    <button class="btn-main btn-gray" onclick="document.getElementById('p_in').click()">📷 TAKE GPS TAGGED PHOTO</button>
                    <input type="file" id="p_in" accept="image/*" capture="camera" multiple style="display:none;" onchange="UIEngine.compressAndAdd(this)">
                </div>

                <button id="sync_btn" class="btn-main btn-green" onclick="window.SupplierEngine.syncToCloud()">🚀 FINISH & SYNC TO CLOUD</button>
            </div>
        `;

        setTimeout(() => { MapEngine.init(); SupplierEngine.loadDashboardStats(); }, 600);
    },

    autoSelectAll: function(c) { document.querySelectorAll('.loc-check').forEach(el => el.checked = c); },

    toggleMat: function(m, show) {
        const div = document.getElementById('sub_' + m.replace(' ', ''));
        if (!show) { div.style.display = 'none'; return; }
        div.style.display = 'block';
        const d = this.materials[m];
        div.innerHTML = `
            <small style="color:var(--accent)">Types</small>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-bottom:10px;">
                ${d.vars.map(v => `<label style="font-size:10px;"><input type="checkbox" class="v-check" data-mat="${m}" value="${v}"> ${v}</label>`).join('')}
            </div>
            <small style="color:var(--accent)">Brands</small>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                ${d.brands.map(b => `<label style="font-size:10px;"><input type="checkbox" class="b-check" data-mat="${m}" value="${b}"> ${b}</label>`).join('')}
            </div>
        `;
    },

    syncWA: function(t) { 
        const mob = document.getElementById(t + '_mob').value;
        document.getElementById(t + '_wa').value = mob;
    },
    renderFleet: function(n) {
        const id = 'fl_' + n.toLowerCase().replace(' ', '');
        return `<div class="counter-box"><small>${n}</small><div class="counter-controls"><button onclick="UIEngine.step('${id}',-1)">-</button><b id="${id}">0</b><button onclick="UIEngine.step('${id}',1)">+</button></div></div>`;
    },
    step: function(id, v) {
        let b = document.getElementById(id);
        let c = parseInt(b.innerText);
        if (c + v >= 0 && c + v <= 20) b.innerText = c + v;
    },

    compressAndAdd: function(input) {
        const gps = document.getElementById('form_coords')?.value || "No GPS Fix";
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
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    ctx.fillStyle = "rgba(0,0,0,0.5)";
                    ctx.fillRect(0, h - 30, w, 30);
                    ctx.fillStyle = "white";
                    ctx.font = "bold 12px Arial";
                    ctx.fillText(`📍 ${gps} | ${new Date().toLocaleString()}`, 10, h - 10);
                    this.photos.push(canvas.toDataURL('image/jpeg', 0.6));
                    this.renderPhotoGrid();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    },

    renderPhotoGrid: function() {
        document.getElementById('photo_grid').innerHTML = this.photos.map((src, i) => `<div style="position:relative; width:100%; padding-top:100%; background:url(${src}) center/cover; border-radius:8px; border:1px solid var(--accent);"><div onclick="UIEngine.removePhoto(${i})" style="position:absolute; top:-2px; right:-2px; background:red; color:white; width:18px; height:18px; font-size:12px; border-radius:50%; text-align:center; cursor:pointer;">×</div></div>`).join('');
    },
    removePhoto: function(i) { this.photos.splice(i, 1); this.renderPhotoGrid(); }
};
window.UIEngine = UIEngine;
