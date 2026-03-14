/**
 * INFRA DEPOT - ENTERPRISE UI v2.2 (Final Pro Hierarchy)
 */
export const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';
        document.getElementById('auth_layer').style.display = 'none';

        const hierarchy = {
            "Sand": ["M-Sand", "P-Sand", "River Sand", "Banas Sand"],
            "Aggregates": ["10mm", "20mm", "40mm", "65mm", "Grit", "Dust"],
            "Stone": ["Stone Boulders", "Random Rubble", "Khanda", "Kota Stone"],
            "Cement": ["UltraTech", "Ambuja", "ACC", "JK Lakshmi", "Shree", "Dalmia", "Wonder", "Birla"],
            "Steel": ["Tata Tiscon", "JSW", "SAIL", "Vizag", "Jindal", "Kamdhenu", "Rathi"],
            "Bricks": ["Red Bricks", "AAC Blocks", "Fly Ash", "CLC Blocks"]
        };

        const fleet = ["Tractor", "Mini Truck", "Truck", "Mini Dumper", "Dumper", "Trailer"];

        appLayer.innerHTML = `
            <div style="background:#f3f4f6; min-height:100vh; padding-bottom:100px; font-family:sans-serif;">
                <div style="padding:15px;">
                    
                    <div class="card" style="background:#fff; border-radius:12px; padding:20px; margin-bottom:15px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                        <div class="section-label">2. ENTITY & CONTACTS</div>
                        <input type="text" id="firm_name" placeholder="Enter Firm Name" style="border:1px solid #ddd; color:#000;">
                        
                        <div style="height:1px; background:#eee; margin:15px 0;"></div>
                        
                        <input type="text" id="owner_name" placeholder="Owner Full Name" style="border:1px solid #ddd; color:#000;">
                        <div class="dashboard-grid">
                            <input type="number" id="owner_phone" placeholder="Owner Phone" oninput="document.getElementById('owner_wa').value=this.value" style="border:1px solid #ddd; color:#000;">
                            <input type="number" id="owner_wa" placeholder="Owner WhatsApp" style="border:1px solid #ddd; color:#000;">
                        </div>

                        <input type="text" id="mgr_name" placeholder="Manager Name" style="border:1px solid #ddd; color:#000; margin-top:10px;">
                        <div class="dashboard-grid">
                            <input type="number" id="mgr_phone" placeholder="Manager Phone" oninput="document.getElementById('mgr_wa').value=this.value" style="border:1px solid #ddd; color:#000;">
                            <input type="number" id="mgr_wa" placeholder="Manager WhatsApp" style="border:1px solid #ddd; color:#000;">
                        </div>
                    </div>

                    <div class="card" style="background:#fff; border-radius:12px; padding:20px; margin-bottom:15px;">
                        <div class="section-label">3. GPS & VERIFICATION</div>
                        <div id="survey_map" style="height:200px; border-radius:8px; margin-bottom:10px;"></div>
                        <button class="btn-main" onclick="window.MapEngine.captureGPS()" style="background:#111; color:#fff;">📍 CAPTURE GPS & ADDRESS</button>
                        <textarea id="business_address" placeholder="Address will auto-fill..." style="width:100%; border:1px solid #ddd; margin-top:10px; border-radius:8px; padding:10px;"></textarea>
                        <input type="text" id="survey_coords" placeholder="Coordinates" readonly style="background:#f9fafb; margin-top:5px;">
                    </div>

                    <div class="card" style="background:#fff; border-radius:12px; padding:20px; margin-bottom:15px;">
                        <div class="section-label">4. MATERIALS INTELLIGENCE</div>
                        ${Object.keys(hierarchy).map(mat => `
                            <div style="margin-bottom:10px; border:1px solid #eee; border-radius:8px; overflow:hidden;">
                                <label style="display:flex; align-items:center; padding:12px; background:#f9fafb; cursor:pointer;">
                                    <input type="checkbox" style="width:20px; margin-right:15px;" onchange="document.getElementById('sub_${mat}').style.display = this.checked ? 'block' : 'none'">
                                    <span style="font-weight:bold; color:#111;">${mat}</span>
                                </label>
                                <div id="sub_${mat}" style="display:none; padding:10px 15px; background:#fff; border-top:1px solid #eee;">
                                    <p style="font-size:10px; color:#f59e0b; margin-bottom:8px;">SELECT VARIETY / BRANDS:</p>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                                        ${hierarchy[mat].map(brand => `
                                            <label style="font-size:12px; color:#444; display:flex; align-items:center;">
                                                <input type="checkbox" class="mat-item" data-cat="${mat}" value="${brand}" style="width:14px; margin-right:8px;"> ${brand}
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="card" style="background:#fff; border-radius:12px; padding:20px; margin-bottom:15px;">
                        <div class="section-label">5. TRANSPORTATION FLEET</div>
                        <div class="dashboard-grid">
                            ${fleet.map(type => `
                                <div style="background:#f9fafb; padding:15px; border-radius:10px; text-align:center; border:1px solid #eee;">
                                    <div style="font-size:12px; font-weight:bold; color:#111; margin-bottom:10px;">${type}</div>
                                    <div style="display:flex; justify-content:center; align-items:center; gap:15px;">
                                        <button onclick="window.updateCounter('${type}', -1)" style="width:30px; height:30px; background:#111; color:#fff; border:none; border-radius:6px; cursor:pointer;">-</button>
                                        <b id="count_${type}" style="font-size:18px; min-width:25px; color:#111;">0</b>
                                        <button onclick="window.updateCounter('${type}', 1)" style="width:30px; height:30px; background:#111; color:#fff; border:none; border-radius:6px; cursor:pointer;">+</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <button class="btn-main" onclick="window.syncSurveyNow()" style="background:#10b981; color:#fff; height:60px; font-size:18px; box-shadow:0 4px 10px rgba(16,185,129,0.3);">🚀 SUBMIT INDUSTRY SYNC</button>
                </div>
            </div>
        `;

        window.fleetData = {};
        fleet.forEach(t => window.fleetData[t] = 0);
        setTimeout(() => window.MapEngine.init('survey_map'), 500);
    }
};

window.updateCounter = function(t, c) {
    let v = (window.fleetData[t] || 0) + c;
    if (v >= 0 && v <= 20) {
        window.fleetData[t] = v;
        document.getElementById(`count_${t}`).innerText = v;
    }
};

window.syncSurveyNow = async function() {
    const selectedMats = {};
    document.querySelectorAll('.mat-item:checked').forEach(el => {
        const cat = el.getAttribute('data-cat');
        if(!selectedMats[cat]) selectedMats[cat] = [];
        selectedMats[cat].push(el.value);
    });

    const data = {
        firmName: document.getElementById('firm_name').value,
        owner: { name: document.getElementById('owner_name').value, phone: document.getElementById('owner_phone').value, wa: document.getElementById('owner_wa').value },
        manager: { name: document.getElementById('mgr_name').value, phone: document.getElementById('mgr_phone').value, wa: document.getElementById('mgr_wa').value },
        address: document.getElementById('business_address').value,
        coords: document.getElementById('survey_coords').value,
        fleet: window.fleetData,
        materials: selectedMats
    };

    if (!data.firmName || !data.coords) return alert("Firm Name & GPS required!");
    try {
        const { pushSurveyToCloud } = await import('./storage.js');
        await pushSurveyToCloud(data);
        alert("✅ Industry Intelligence Synced!");
        location.reload();
    } catch (e) { alert("Error Syncing"); }
};

window.UIEngine = UIEngine;
