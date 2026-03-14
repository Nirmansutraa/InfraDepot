/**
 * INFRA DEPOT - UI & FIELD ENGINE
 */
export const UIEngine = {
    init: function() {
        const appLayer = document.getElementById('app_layer');
        const authLayer = document.getElementById('auth_layer');
        if (authLayer) authLayer.style.display = 'none';
        appLayer.style.display = 'block';

        appLayer.innerHTML = `
            <div class="card">
                <div class="section-label">New Site Survey</div>
                <input type="text" id="firm_name" placeholder="Construction Firm Name">
                
                <div class="dashboard-grid">
                    <input type="text" id="survey_lat" placeholder="Latitude" readonly>
                    <input type="text" id="survey_lng" placeholder="Longitude" readonly>
                </div>

                <button class="btn-main btn-circle" onclick="window.MapEngine.captureGPS()" style="margin-bottom:15px; width:100%; border-radius:10px;">
                    📍 CAPTURE GPS LOCATION
                </button>

                <button class="btn-main btn-green" onclick="window.syncSurveyNow()">
                    FINISH & SYNC TO CLOUD
                </button>
            </div>
        `;

        // Initialize Map in background if needed
        if (window.MapEngine) window.MapEngine.init('admin_map');
    }
};

// THE ULTIMATE FIX: This function is now directly available to the button
window.syncSurveyNow = async function() {
    const name = document.getElementById('firm_name')?.value.trim();
    const lat = document.getElementById('survey_lat')?.value;
    const lng = document.getElementById('survey_lng')?.value;

    if (!name || !lat || !lng) return alert("Fill Name and Capture GPS first!");

    try {
        const user = JSON.parse(localStorage.getItem('infra_user') || '{}');
        const { pushSurveyToCloud } = await import('./storage.js');
        
        await pushSurveyToCloud({
            firmName: name,
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            staffId: user.id || 'unknown'
        });

        alert("✅ Survey Synced Successfully!");
        location.reload();
    } catch (e) {
        console.error(e);
        alert("Sync Failed. Check Internet.");
    }
};

window.UIEngine = UIEngine;
