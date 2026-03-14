/**
 * INFRA DEPOT - SUPER ADMIN INTELLIGENCE v2.1
 */
export const AdminEngine = {
    init: function() {
        console.log("Admin: Building Intelligence Dashboard...");
        const viewport = document.getElementById('main_viewport');
        if (!viewport) return;

        viewport.innerHTML = `
            <div style="padding:20px; background:#f3f4f6; min-height:100vh; font-family:sans-serif;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div>
                        <h2 style="margin:0; font-size:22px; color:#111827; letter-spacing:-0.5px;">SUPER ADMIN</h2>
                        <div style="display:flex; align-items:center; gap:5px;">
                            <div style="width:8px; height:8px; background:#10b981; border-radius:50%; animation: pulse 2s infinite;"></div>
                            <span style="font-size:11px; color:#6b7280; font-weight:bold; text-transform:uppercase;">Live Market Feed</span>
                        </div>
                    </div>
                    <button onclick="localStorage.clear(); location.reload();" style="background:#ef4444; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer; box-shadow:0 2px 4px rgba(239,68,68,0.2);">LOGOUT</button>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:20px;">
                    <div class="card" style="text-align:center; padding:20px; margin:0; border-left:4px solid #f59e0b;">
                        <small style="color:#6b7280; font-size:10px; font-weight:bold; letter-spacing:1px;">TOTAL SURVEYS</small>
                        <div id="stat_total" style="font-size:32px; font-weight:900; color:#111827; margin-top:5px;">0</div>
                    </div>
                    <div class="card" style="text-align:center; padding:20px; margin:0; border-left:4px solid #10b981;">
                        <small style="color:#6b7280; font-size:10px; font-weight:bold; letter-spacing:1px;">ACTIVE STAFF</small>
                        <div id="stat_staff" style="font-size:32px; font-weight:900; color:#111827; margin-top:5px;">0</div>
                    </div>
                </div>

                <div class="card" style="padding:10px; margin-bottom:20px;">
                    <div style="padding:10px; font-size:11px; font-weight:bold; color:#111827; display:flex; align-items:center; gap:8px;">
                        <span>📍</span> UDAIPUR INFRASTRUCTURE MAP
                    </div>
                    <div id="admin_map" style="height:350px; border-radius:8px; background:#eee;"></div>
                </div>

                <div class="card" style="padding:0; overflow:hidden; border-radius:12px;">
                    <div style="padding:15px; background:#fff; border-bottom:1px solid #f3f4f6; font-size:12px; font-weight:bold; color:#111827;">
                        📋 RECENT FIELD SUBMISSIONS
                    </div>
                    <div id="survey_feed" style="max-height:450px; overflow-y:auto; background:#fff;">
                        <div style="padding:40px; text-align:center; color:#9ca3af; font-size:13px;">
                            Initializing cloud connection...
                        </div>
                    </div>
                </div>
            </div>

            <style>
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                .feed-item:hover { background: #f9fafb; }
            </style>
        `;

        // Wait for viewport to render, then load Map and Data
        setTimeout(() => {
            if (window.MapEngine) {
                window.MapEngine.init('admin_map');
                this.loadRealTimeData();
            }
        }, 500);
    },

    loadRealTimeData: async function() {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            // Get all surveys (Bypassing index requirement for immediate fix)
            const querySnapshot = await getDocs(collection(window.db, "surveys"));
            
            const feed = document.getElementById('survey_feed');
            const totalStat = document.getElementById('stat_total');
            const staffStat = document.getElementById('stat_staff');
            
            totalStat.innerText = querySnapshot.size;
            
            const uniqueStaff = new Set();
            let feedHtml = "";

            // Loop through data
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                
                // Track Unique Staff
                if(data.staffId) uniqueStaff.add(data.staffId);

                // Add Point to Map if MapEngine is ready
                if (data.location && window.MapEngine.map) {
                    L.marker([data.location.lat, data.location.lng])
                     .addTo(window.MapEngine.map)
                     .bindPopup(`
                        <div style="font-family:sans-serif;">
                            <b style="color:#111827;">${data.firmName || 'Infrastructure Site'}</b><br>
                            <small style="color:#6b7280;">Staff: ${data.staffId || 'Unknown'}</small>
                        </div>
                     `);
                }

                // Build Feed Row
                feedHtml += `
                    <div class="feed-item" style="padding:15px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center; transition:0.2s;">
                        <div style="flex:1;">
                            <div style="font-weight:bold; color:#111827; font-size:14px;">${data.firmName || 'Unnamed Firm'}</div>
                            <div style="font-size:11px; color:#6b7280; margin-top:3px; line-height:1.4;">
                                ${data.address ? data.address.substring(0, 60) + '...' : 'Coordinates captured'}
                            </div>
                        </div>
                        <div style="text-align:right; margin-left:15px;">
                            <div style="font-size:10px; font-weight:bold; color:#f59e0b; text-transform:uppercase;">${data.staffId || 'FIELD'}</div>
                            <div style="font-size:9px; color:#9ca3af; margin-top:2px;">verified site</div>
                        </div>
                    </div>
                `;
            });

            // Update Staff Count
            staffStat.innerText = uniqueStaff.size;

            // Update Feed HTML
            feed.innerHTML = feedHtml || '<div style="padding:40px; text-align:center; color:#9ca3af;">No field surveys found in cloud.</div>';

        } catch (e) {
            console.error("Admin Dashboard Error:", e);
            document.getElementById('survey_feed').innerHTML = `
                <div style="padding:20px; color:#ef4444; font-size:12px; text-align:center;">
                    <b>Sync Error:</b> ${e.message}<br>
                    <small>Check Firebase Console for Index Requirements</small>
                </div>`;
        }
    }
};

window.AdminEngine = AdminEngine;
