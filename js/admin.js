/**
 * INFRA DEPOT - ADMIN ENGINE
 */
export const AdminEngine = {
    init: function(isFullAdmin) {
        console.log("Admin: Initializing Dashboard...");
        const viewport = document.getElementById('main_viewport');
        if (!viewport) return;

        viewport.innerHTML = `
            <div style="padding:20px; background:#f3f4f6; min-height:100vh;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h2 style="margin:0; font-size:18px;">SUPER ADMIN</h2>
                    <button onclick="localStorage.clear(); location.reload();" style="background:#ef4444; color:#fff; border:none; padding:8px 15px; border-radius:5px; font-weight:bold;">LOGOUT</button>
                </div>
                
                <div id="admin_stats" class="dashboard-grid">
                    <div class="stat" style="background:#fff; padding:15px; border-radius:10px; text-align:center;">
                        <small style="color:#666;">DATA ENTRIES</small>
                        <div id="total_data" style="font-size:24px; font-weight:bold; color:#10b981;">...</div>
                    </div>
                </div>

                <div class="card" style="background:#fff; padding:20px; border-radius:12px; margin-top:20px;">
                    <div style="color:#f59e0b; font-size:10px; font-weight:bold; margin-bottom:10px;">LIVE INFRA MAP</div>
                    <div id="admin_map" style="height:400px; border-radius:10px;"></div>
                </div>
            </div>
        `;

        setTimeout(() => {
            if (window.MapEngine) window.MapEngine.init('admin_map');
        }, 300);
    }
};

// Also attach to window just in case
window.AdminEngine = AdminEngine;
