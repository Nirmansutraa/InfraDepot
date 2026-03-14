/**
 * INFRA DEPOT - MAIN APPLICATION CONTROLLER
 * Managed by CTO/CDO Team (March 2026 Edition)
 */

const App = {
    // This is the first function that runs when the app starts
    init: function() {
        console.log("InfraDepot: System Booting...");
        
        // Check if we have a saved session (Simple check for now)
        const userSession = localStorage.getItem('infra_session');

        if (userSession) {
            // User is already logged in, go straight to Dashboard
            this.launchDashboard();
        } else {
            // No session found, show Login Screen
            this.launchAuth();
        }
    },

    // Triggers the Login Flow
    launchAuth: function() {
        console.log("App: Launching Auth Layer...");
        if (typeof AuthEngine !== 'undefined') {
            AuthEngine.renderLogin();
        } else {
            console.error("AuthEngine not found! Check your index.html scripts.");
        }
    },

    // Triggers the Main Survey App
    launchDashboard: function() {
        console.log("App: Launching App Layer...");
        
        // Hide Login, Show App
        document.getElementById('auth_layer').style.display = 'none';
        document.getElementById('app_layer').style.display = 'block';

        // Initialize UI and Map
        if (typeof UIEngine !== 'undefined') {
            UIEngine.init();
        }
    },

    // Helper to save session
    loginSuccess: function(staffId) {
        localStorage.setItem('infra_session', staffId);
        this.launchDashboard();
    },

    // Helper to logout
    logout: function() {
        localStorage.removeItem('infra_session');
        location.reload();
    }
};

// Listen for the page to be fully loaded before starting
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
