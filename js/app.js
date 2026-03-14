/**
 * INFRA DEPOT - MASTER APP CONTROLLER
 */

const AppEngine = {
    init: function() {
        console.log("InfraDepot: System Booting...");
        
        // 1. Check for existing session
        const session = localStorage.getItem('infra_user');
        
        if (!session) {
            console.log("App: No session found. Launching Auth Layer...");
            AuthEngine.init(); // Show Login Screen
        } else {
            console.log("App: Session found. Routing to Role Dashboard...");
            try {
                const user = JSON.parse(session);
                AuthEngine.launchRoleBasedUI(user);
            } catch (e) {
                console.error("Session Corrupt. Clearing...");
                localStorage.clear();
                AuthEngine.init();
            }
        }
    }
};

// Start the engine
window.onload = () => {
    if (window.db) {
        AppEngine.init();
    } else {
        // Wait a second for Firebase to initialize if it's slow
        setTimeout(() => AppEngine.init(), 1000);
    }
};
