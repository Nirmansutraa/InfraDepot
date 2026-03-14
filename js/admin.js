/**
 * INFRA DEPOT - ADMIN ENGINE v1.6
 */
console.log("Admin: Script Loaded Successfully");

export const AdminEngine = {
    init: function(isFullAdmin) {
        const viewport = document.getElementById('main_viewport');
        if (!viewport) return;

        viewport.innerHTML = `
            <div style="padding:20px; background:#f3f4f6; min-height:100vh;">
                <h2 style="margin:0;">SUPER ADMIN</h2>
                <button onclick="localStorage.clear(); location.reload();" style="background:#ef4444; color:#fff; border:none; padding:10px; border-radius:5px; margin-top:10px;">LOGOUT</button>
                <div class="card" style="margin-top:20px;">
                    <div id="admin_map" style="height:300px; border-radius:10px; background:#eee;"></div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            if (window.MapEngine) window.MapEngine.init('admin_map');
        }, 300);
    }
};

window.AdminEngine = AdminEngine;
