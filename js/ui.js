/**
 * INFRA DEPOT - ENTERPRISE UI v2.1 (Full Material Split)
 */
export const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        appLayer.style.display = 'block';
        document.getElementById('auth_layer').style.display = 'none';

        const materials = {
            "Sand": ["M-Sand", "P-Sand", "River Sand", "Banas Sand"],
            "Aggregates": ["10mm", "20mm", "40mm", "65mm", "Grit", "Dust"],
            "Stone": ["Stone Boulders", "Random Rubble", "Khanda", "Kota Stone"],
            "Cement": ["UltraTech", "Ambuja", "ACC", "JK Lakshmi", "Shree", "Dalmia", "Binani", "Wonder", "Birla", "Mycem"],
            "Steel": ["Tata Tiscon", "JSW", "SAIL", "Vizag", "Jindal Panther", "Kamdhenu", "Rathi", "SRMB", "Shyam", "Indus"],
            "Bricks": ["Red Bricks", "AAC Blocks", "Fly Ash", "CLC Blocks"]
        };

        appLayer.innerHTML = `
            <div style="background:#f3f4f6; min-height:100vh; padding-bottom:50px;">
                <div style="padding:15px;">
                    <div class="card" style="background:#fff; border-radius:12px; padding:15px; margin-bottom:15px;">
                        <div class="section-label">2. ENTITY & CONTACTS</div>
                        <input type="text" id="firm_name" placeholder="Enter Firm Name">
                        <input type="text" id="mgr_name" placeholder="Manager Name">
                        <div class="dashboard-grid">
                            <input type="number" id="mgr_phone" placeholder="Phone">
                            <input type="number" id="mgr_whatsapp" placeholder="WhatsApp">
                        </div>
                    </div>

                    <div class="card" style="background:#fff; border-radius:12px; padding:15px; margin-bottom:15px;">
                        <div class="section-label">3. GPS & VERIFICATION</div>
                        <div id="survey_map" style="height:180px; border-radius:8px; margin-bottom:10px;"></div>
                        <button class="btn-main" onclick="window.MapEngine.captureGPS()" style="background:#111; color:#fff;">📍 CAPTURE GPS & ADDRESS</button>
                        <textarea id="business_address" placeholder="Waiting for GPS to fetch address..." style="width:100%; height:60px; margin-top:10px; padding:10px; border:1px solid #ddd; border-radius:8px; font-size:12px;"></textarea>
                        <input type="text" id="survey_coords" placeholder="Coordinates" readonly style="margin-top:5px; background:#f9fafb;">
                    </div>

                    <div class="card" style="background:#fff; border-radius:12px; padding:15px; margin-bottom:15px;">
                        <div class="section-label">4. MATERIALS INTELLIGENCE</div>
                        ${Object.keys(materials).map(cat => `
                            <div style="margin-bottom:12px;">
                                <label style="font-weight:bold; font-size:13px;">${cat}</label>
                                <select id="brands_${cat.toLowerCase()}" multiple style="height:70px; margin-top:5px; font-size:12px;">
                                    ${materials[cat].map(i => `<option value="${i}">${i}</option>`).join('')}
                                </select>
                            </div>
                        `).join('')}
                    </div>

                    <div class="card" style="background:#fff; border-radius:12px; padding:15px; margin-bottom:15px;">
                        <div class="section-label">5. TRANSPORTATION FLEET</div>
                        <div class="dashboard-grid">
                            ${["Tractor", "Mini Truck", "Truck", "Mini Dumper", "Dumper", "Trailer"].map(type => `
                                <div style="background:#f9fafb; padding:8px; border-radius:8px; text-align:center; border:1px solid #eee;">
                                    <div style="font-size:10px; margin-bottom:5px;">${type}</div>
                                    <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
                                        <button onclick="window.updateCounter('${type}', -1)" style="width:24px; height:24px; background:#111; color:#fff; border:none; border-radius:4px;">-</button>
                                        <b id="count_${type}" style="min-width:20px;">0</b>
                                        <button onclick="window.updateCounter('${type}', 1)" style="width:24px; height:24px; background:#111; color:#fff; border:none; border-radius:4px;">+</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <button class="btn-main" onclick="window.syncSurveyNow()" style="background:#10b981; color:#fff; height:50px; font-size:16px;">🚀 SUBMIT INDUSTRY SYNC</button>
                </div>
            </div>
        `;

        window.fleetData = {};
        ["Tractor", "Mini Truck", "Truck", "Mini Dumper", "Dumper", "Trailer"].forEach(t => window.fleetData[t] = 0);
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
    const data = {
        firmName: document.getElementById('firm_name').value,
        manager: { name: document.getElementById('mgr_name').value, phone: document.getElementById('mgr_phone').value, whatsapp: document.getElementById('mgr_whatsapp').value },
        address: document.getElementById('business_address').value,
        coords: document.getElementById('survey_coords').value,
        fleet: window.fleetData,
        materials: {
            sand: Array.from(document.getElementById('brands_sand').selectedOptions).map(o => o.value),
            aggregates: Array.from(document.getElementById('brands_aggregates').selectedOptions).map(o => o.value),
            stone: Array.from(document.getElementById('brands_stone').selectedOptions).map(o => o.value),
            cement: Array.from(document.getElementById('brands_cement').selectedOptions).map(o => o.value),
            steel: Array.from(document.getElementById('brands_steel').selectedOptions).map(o => o.value),
            bricks: Array.from(document.getElementById('brands_bricks').selectedOptions).map(o => o.value)
        }
    };

    if (!data.firmName || !data.coords) return alert("Firm Name & GPS required!");
    try {
        const { pushSurveyToCloud } = await import('./storage.js');
        await pushSurveyToCloud(data);
        alert("✅ Industry Intelligence Saved!");
        location.reload();
    } catch (e) { alert("Error Syncing"); }
};

window.UIEngine = UIEngine;
