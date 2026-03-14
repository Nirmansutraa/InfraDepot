/**
 * INFRA DEPOT - MASTER CONTROLLER v6.3
 */

const AppEngine = {
    init: function() {
        console.log("InfraDepot: System Booting...");
        
        // 1. Check if a user session exists in local storage
        const session = localStorage.getItem('infra_user');
        
        if (!session) {
            console.log("App: No session. Loading Auth Layer...");
            // Load only Auth (Login Screen)
            if (window.AuthEngine) {
                window.AuthEngine.init();
            }
        } else {
            console.log("App: Session active. Verifying Role...");
            try {
                const user = JSON.parse(session);
                // Load the appropriate Dashboard
                if (window.AuthEngine) {
                    window.AuthEngine.launchRoleBasedUI(user);
                }
            } catch (e) {
                console.error("Session Corrupt. Resetting...");
                localStorage.clear();
                location.reload();
            }
        }
    }
};

// Start the engine only after all scripts and Firebase are ready
window.addEventListener('load', () => {
    // Small delay to ensure Firebase (window.db) is initialized
    setTimeout(() => {
        AppEngine.init();
    }, 500);
});
