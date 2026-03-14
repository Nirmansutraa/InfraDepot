/**
 * INFRA DEPOT - SUPER ADMIN INTELLIGENCE v2.0
 */
export const AdminEngine = {
    init: function() {
        console.log("Admin: Building Intelligence Dashboard...");
        const viewport = document.getElementById('main_viewport');
        if (!viewport) return;

        viewport.innerHTML = `
            <div style="padding:20px; background:#f3f4f6; min-height:100vh;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h2 style="margin:0; font-size:22px; color:#111827;">SUPER ADMIN</h2>
                        <p style="margin:0; font-size:12px; color:#6b7280;">Real-time Market Intelligence</p>
                    </div>
                    <button onclick="localStorage.clear(); location.reload();" style="background:#ef4444; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">LOGOUT</button>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:20px;">
                    <div class="card" style="text-align:center; padding:15px; margin:0;">
                        <small style="color:#f59e0b; font-weight:bold;">TOTAL SURVEYS</small>
                        <div id="stat_total" style="font-size:32px; font-weight:900; color:#111827;">0</div>
                    </div>
                    <div class="card" style="text-align:center; padding:15px; margin:0;">
                        <small style="color:#10b981; font-weight:bold;">ACTIVE STAFF</small>
                        <div id="stat_staff" style="font-size:32px; font-weight:900; color:#111827;">...</div>
                    </div>
                </div>

                <div class="card" style="padding:10px; margin-bottom:20px;">
                    <div class="section-label" style="margin:10px;">📍 LIVE INFRA MAP</div>
                    <div id="admin_map" style="height:350px; border-radius:10px;"></div>
                </div>

                <div class="card" style="padding:0; overflow:hidden;">
                    <div class="section-label" style="padding:15px; border-bottom:1px solid #eee;">📋 LATEST FIELD INTELLIGENCE</div>
                    <div id="survey_feed" style="max-height:400px; overflow-y:auto; background:#fff;">
                        <div style="padding:20px; text-align:center; color:#999;">Fetching cloud data...</div>
                    </div>
                </div>
            </div>
        `;

        // Initialize Map and Load Data
        setTimeout(() => {
            if (window.MapEngine) {
                window.MapEngine.init('admin_map');
                this.loadRealTimeData();
            }
        }, 500);
    },

    loadRealTimeData: async function() {
        try {
            const { collection, getDocs, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            const q = query(collection(window.db, "surveys"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            
            const feed = document.getElementById('survey_feed');
            const totalStat = document.getElementById('stat_total');
            
            totalStat.innerText = querySnapshot.size;
            let feedHtml = "";

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : 'Just now';
                
                // Add marker to map if coordinates exist
                if (data.location && window.MapEngine.map) {
                    L.marker([data.location.lat, data.location.lng])
                     .addTo(window.MapEngine.map)
                     .bindPopup(`<b>${data.firmName}</b><br>${data.address || 'Field Entry'}`);
                }

                feedHtml += `
                    <div style="padding:15px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:bold; color:#111827; font-size:14px;">${data.firmName || 'New Site'}</div>
                            <div style="font-size:11px; color:#6b7280; margin-top:2px;">${data.address || 'Coordinates captured'}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:10px; font-weight:bold; color:#f59e0b;">${date}</div>
                            <div style="font-size:9px; color:#999;">Staff: ${data.staffId || 'Unknown'}</div>
                        </div>
                    </div>
                `;
            });

            feed.innerHTML = feedHtml || '<div style="padding:20px; text-align:center;">No data available yet.</div>';

        } catch (e) {
            console.error("Admin Load Error:", e);
            document.getElementById('survey_feed').innerHTML = '<div style="padding:20px; color:red;">Failed to load data.</div>';
        }
    }
};

window.AdminEngine = AdminEngine;
