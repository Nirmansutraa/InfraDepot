import { materialsData } from '../data/materials.js';

export const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        const trackingID = "ID-" + Math.floor(100000 + Math.random() * 900000);
        
        appLayer.innerHTML = `
            <div id="survey_container" style="padding-bottom:100px;">
                
                <div class="card" style="background:var(--primary); color:white; text-align:center;">
                    <div class="section-label" style="color:#10b981;">1. TRACKING ID</div>
                    <div style="font-size:28px; font-family:monospace; font-weight:bold;">${trackingID}</div>
                </div>

                <div class="card">
                    <div class="section-label">2. ENTITY & CONTACTS</div>
                    <input type="text" id="firm_name" placeholder="Primary Firm Name">
                    
                    <p style="font-size:10px; margin:10px 0 2px;">OWNER DETAILS</p>
                    <input type="text" id="owner_name" placeholder="Owner Full Name">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <input type="number" id="owner_phone" placeholder="Phone" oninput="document.getElementById('owner_wa').value=this.value">
                        <input type="number" id="owner_wa" placeholder="WhatsApp">
                    </div>

                    <p style="font-size:10px; margin:10px 0 2px;">MANAGER CONTACT</p>
                    <input type="text" id="mgr_name" placeholder="Manager Name">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <input type="number" id="mgr_phone" placeholder="Phone" oninput="document.getElementById('mgr_wa').value=this.value">
                        <input type="number" id="mgr_wa" placeholder="WhatsApp">
                    </div>
                    
                    <textarea id="business_address" placeholder="Business Address (Auto-fills on GPS)"></textarea>
                </div>

                <div class="card">
                    <div class="section-label">3. GPS & VERIFICATION</div>
                    <div id="survey_map" style="height:180px; border-radius:10px; margin-bottom:10px;"></div>
                    <button class="btn-main" onclick="window.MapEngine.captureGPS()">📍 CAPTURE GPS & ADDRESS</button>
                    <input type="text" id="survey_coords" placeholder="Coordinates" readonly>
                    
                    <div style="border:2px dashed #ccc; padding:20px; text-align:center; border-radius:10px; margin-top:10px;" onclick="document.getElementById('photo_up').click()">
                        📸 Tap to capture business photos
                        <input type="file" id="photo_up" accept="image/*" capture="camera" style="display:none;" onchange="window.handlePhoto(this)">
                    </div>
                    <div id="photo_preview" style="display:flex; gap:10px; margin-top:10px; overflow-x:auto;"></div>
                </div>

                <div class="card">
                    <div class="section-label">4. MATERIALS INTELLIGENCE</div>
                    <div id="hierarchy_container"></div>
                </div>

                <div class="card">
                    <div class="section-label">5. TRANSPORTATION FLEET</div>
                    <div id="fleet_container"></div>
                </div>

                <div style="padding:12px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <button class="btn-main" style="background:#64748b;">SAVE LOCAL</button>
                    <button class="btn-main btn-sync" onclick="window.syncNow()">SUBMIT SYNC</button>
                </div>
            </div>
        `;

        this.renderHierarchy();
        this.renderFleet();
        setTimeout(() => window.MapEngine.init('survey_map'), 500);
    },

    renderHierarchy: function() {
        const container = document.getElementById('hierarchy_container');
        Object.keys(materialsData).forEach(mat => {
            const div = document.createElement('div');
            div.className = 'mat-card';
            div.innerHTML = `
                <div class="mat-header" onclick="window.toggleDiv('var_${mat}')">
                    <span>${mat}</span>
                    <span>▼</span>
                </div>
                <div id="var_${mat}" class="variety-box">
                    ${materialsData[mat].varieties.map(v => `
                        <div style="margin-bottom:8px;">
                            <label><input type="checkbox" onchange="window.toggleDiv('brand_${v.replace(/ /g,'')}')"> ${v}</label>
                            <div id="brand_${v.replace(/ /g,'')}" class="brand-box">
                                ${materialsData[mat].brands.map(b => `
                                    <label style="display:block; font-size:12px; margin:4px 0;">
                                        <input type="checkbox" class="data-brand" data-mat="${mat}" data-var="${v}" value="${b}"> ${b}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(div);
        });
    },

    renderFleet: function() {
        const fleet = ["Tractor", "Mini Truck", "Truck", "Mini Dumper", "Dumper", "Trailer"];
        const container = document.getElementById('fleet_container');
        fleet.forEach(f => {
            const div = document.createElement('div');
            div.className = 'stepper';
            div.innerHTML = `
                <span style="font-size:14px; font-weight:bold;">${f}</span>
                <div style="display:flex; align-items:center; gap:15px;">
                    <button class="step-btn" onclick="window.updateStep('${f}', -1)">-</button>
                    <b id="count_${f}">0</b>
                    <button class="step-btn" onclick="window.updateStep('${f}', 1)">+</button>
                </div>
            `;
            container.appendChild(div);
        });
    }
};

window.toggleDiv = (id) => {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
};

window.updateStep = (id, val) => {
    const el = document.getElementById(`count_${id}`);
    let curr = parseInt(el.innerText);
    if(curr + val >= 0) el.innerText = curr + val;
};

window.syncNow = async function() {
    alert("Initiating Enterprise Sync...");
    // Logic to collect all brands, fleet, and coordinates to Firestore
};

window.UIEngine = UIEngine;
