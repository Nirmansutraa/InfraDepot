/**
 * NIRMANSUTRA MASTER CORE ENGINE v2.0
 * Merged: State Controller + UIEngine + Survey Logic
 */

import { materialsData } from '../data/materials.js';

const App = {
    init: function() {
        // Clear any previous "ghost" layers
        document.body.innerHTML = '<div id="main_viewport"></div>';
        this.render();
    },

    render: function() {
        const viewport = document.getElementById('main_viewport');
        const user = JSON.parse(localStorage.getItem('infra_user'));

        if (user) {
            console.log("App: Session active.");
            viewport.innerHTML = '<div id="app_layer" style="display:block;"></div>';
            
            // RBAC Routing
            if (user.role === 'admin' || user.id === 'vijay_master') {
                // Assuming AdminEngine is globally available or imported elsewhere
                if(window.AdminEngine) window.AdminEngine.init(true);
            } else {
                UIEngine.init();
            }
        } else {
            console.log("App: Loading Login...");
            viewport.innerHTML = '<div id="auth_layer" style="display:block;"></div>';
            if(window.AuthEngine) window.AuthEngine.init();
        }
    }
};

export const UIEngine = {
    activePhotos: [],

    init: function() {
        const appLayer = document.getElementById('app_layer');
        const trackingID = "ID-" + Math.floor(100000 + Math.random() * 900000);
        
        appLayer.innerHTML = `
            <div id="survey_container" style="padding-bottom:100px; max-width:600px; margin:auto;">
                
                <div class="card" style="background:#0f1b2d; color:white; text-align:center; padding:20px; border-radius:15px; margin-bottom:15px;">
                    <div style="color:#10b981; font-size:10px; font-weight:bold; letter-spacing:2px;">1. TRACKING ID</div>
                    <div id="sup_id" style="font-size:28px; font-family:monospace; font-weight:bold;">${trackingID}</div>
                </div>

                <div class="card">
                    <div class="section-label">2. ENTITY & CONTACTS</div>
                    <input type="text" id="firm_name" placeholder="Primary Firm Name" oninput="UIEngine.updateID()">
                    
                    <p style="font-size:10px; margin:10px 0 2px; font-weight:bold; color:#64748b;">OWNER DETAILS</p>
                    <input type="text" id="owner_name" placeholder="Owner Full Name">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <input type="number" id="owner_phone" placeholder="Phone" oninput="document.getElementById('owner_wa').value=this.value">
                        <input type="number" id="owner_wa" placeholder="WhatsApp">
                    </div>

                    <p style="font-size:10px; margin:10px 0 2px; font-weight:bold; color:#64748b;">MANAGER CONTACT</p>
                    <input type="text" id="mgr_name" placeholder="Manager Name">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <input type="number" id="mgr_phone" placeholder="Phone" oninput="document.getElementById('mgr_wa').value=this.value">
                        <input type="number" id="mgr_wa" placeholder="WhatsApp">
                    </div>
                    
                    <textarea id="business_address" style="width:100%; margin-top:10px; padding:10px; border-radius:8px; border:1px solid #ddd;" placeholder="Business Address (Auto-fills on GPS)"></textarea>
                </div>

                <div class="card">
                    <div class="section-label">3. GPS & VERIFICATION</div>
                    <div id="survey_map" style="height:180px; border-radius:10px; margin-bottom:10px; background:#eee;"></div>
                    <button class="btn-main" style="width:100%; background:#0f1b2d; color:white; padding:12px; border-radius:8px;" onclick="window.MapEngine.captureGPS()">📍 CAPTURE GPS & ADDRESS</button>
                    <input type="text" id="survey_coords" style="margin-top:10px;" placeholder="Coordinates" readonly>
                    
                    <div style="border:2px dashed #ccc; padding:20px; text-align:center; border-radius:10px; margin-top:10px; cursor:pointer;" onclick="document.getElementById('photo_up').click()">
                        📸 Tap to capture business photos
                        <input type="file" id="photo_up" accept="image/*" capture="camera" style="display:none;" onchange="UIEngine.handlePhotos(this)">
                    </div>
                    <div id="preview_zone" style="display:flex; gap:10px; margin-top:10px; overflow-x:auto;"></div>
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
                    <button class="btn-main" style="background:#64748b; color:white; padding:15px; border-radius:10px;" onclick="UIEngine.saveLocal()">SAVE LOCAL</button>
                    <button class="btn-main btn-sync" style="background:#FF5A00; color:white; padding:15px; border-radius:10px;" onclick="UIEngine.submitData()">SUBMIT SYNC</button>
                </div>

                <div id="history_list" style="padding:12px;"></div>
            </div>
        `;

        this.renderHierarchy();
        this.renderFleet();
        this.refreshHistory();
        
        // Initialize Map if engine exists
        if(window.MapEngine) setTimeout(() => window.MapEngine.init('survey_map'), 500);
    },

    updateID: function() {
        const firm = document.getElementById("firm_name").value;
        const idLabel = document.getElementById("sup_id");
        if(!firm) { idLabel.innerText = "ID---"; return; }
        const rand = Math.floor(1000 + Math.random()*9000);
        idLabel.innerText = "ID-SUP-" + rand;
    },

    handlePhotos: function(input) {
        const files = Array.from(input.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.activePhotos.push(e.target.result);
                this.renderPhotoPreview();
            };
            reader.readAsDataURL(file);
        });
    },

    renderPhotoPreview: function() {
        const zone = document.getElementById("preview_zone");
        zone.innerHTML = "";
        this.activePhotos.forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.style.width = "70px";
            img.style.height = "70px";
            img.style.borderRadius = "8px";
            img.style.objectFit = "cover";
            zone.appendChild(img);
        });
    },

    renderHierarchy: function() {
        const container = document.getElementById('hierarchy_container');
        Object.keys(materialsData).forEach(mat => {
            const div = document.createElement('div');
            div.className = 'mat-card';
            div.innerHTML = `
                <div class="mat-header" style="cursor:pointer; display:flex; justify-content:space-between; padding:10px; background:#f8fafc; margin-bottom:5px; border-radius:8px;" onclick="window.toggleDiv('var_${mat}')">
                    <span style="font-weight:bold;">${mat}</span>
                    <span>▼</span>
                </div>
                <div id="var_${mat}" style="display:none; padding:10px; border-left:2px solid #FF5A00; margin-bottom:10px;">
                    ${materialsData[mat].varieties.map(v => `
                        <div style="margin-bottom:8px;">
                            <label style="font-weight:bold;"><input type="checkbox" onchange="window.toggleDiv('brand_${v.replace(/ /g,'')}')"> ${v}</label>
                            <div id="brand_${v.replace(/ /g,'')}" style="display:none; padding:10px 20px;">
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
            div.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;";
            div.innerHTML = `
                <span style="font-size:14px; font-weight:bold;">${f}</span>
                <div style="display:flex; align-items:center; gap:15px;">
                    <button style="width:30px; height:30px; border-radius:50%; border:1px solid #ccc;" onclick="window.updateStep('${f}', -1)">-</button>
                    <b id="count_${f}">0</b>
                    <button style="width:30px; height:30px; border-radius:50%; border:1px solid #ccc;" onclick="window.updateStep('${f}', 1)">+</button>
                </div>
            `;
            container.appendChild(div);
        });
    },

    saveLocal: function() {
        const firm = document.getElementById("firm_name").value;
        if(!firm) return alert("Firm name required");

        const data = {
            ID: document.getElementById("sup_id").innerText,
            Firm: firm,
            Owner: document.getElementById("owner_name").value,
            GPS: document.getElementById("survey_coords").value,
            Photos: this.activePhotos,
            Timestamp: new Date().toISOString()
        };

        let db = JSON.parse(localStorage.getItem("infra_local_db") || "[]");
        db.unshift(data);
        localStorage.setItem("infra_local_db", JSON.stringify(db));
        alert("Saved locally to device");
        this.refreshHistory();
    },

    refreshHistory: function() {
        const db = JSON.parse(localStorage.getItem("infra_local_db") || "[]");
        const list = document.getElementById("history_list");
        if(!list) return;
        list.innerHTML = `<p style="font-size:10px; font-weight:bold; color:#64748b; margin-top:20px;">RECENT LOCAL ENTRIES</p>` + 
        db.slice(0,3).map(item => `
            <div style="background:white; padding:10px; border-radius:8px; border:1px solid #eee; margin-top:5px; font-size:12px;">
                <b>${item.Firm}</b> <span style="float:right; color:#FF5A00;">${item.ID}</span>
            </div>
        `).join("");
    },

    submitData: async function() {
        const firm = document.getElementById("firm_name").value;
        if(!firm) return alert("Firm name required for Cloud Sync");
        
        alert("Initiating Cloud Sync with Firebase...");
        // Add your final Firestore .add() logic here
    }
};

// Global Helpers attached to window for HTML onclick events
window.toggleDiv = (id) => {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
};

window.updateStep = (id, val) => {
    const el = document.getElementById(`count_${id}`);
    let curr = parseInt(el.innerText);
    if(curr + val >= 0) el.innerText = curr + val;
};

window.addEventListener('DOMContentLoaded', () => App.init());
export default App;
