/**
 * INFRA DEPOT - MASTER CONTROLLER v1.4
 */
import { AuthEngine } from './auth.js';
import { AdminEngine } from './admin.js';
import { UIEngine } from './ui.js';

const App = {
    init: function() {
        console.log("InfraDepot: System Booting...");
        
        // Setup a single clean viewport
        const body = document.body;
        body.innerHTML = '<div id="main_viewport" style="width:100%; min-height:100vh;"></div>';
        
        const user = JSON.parse(localStorage.getItem('infra_user'));

        if (user) {
            console.log("App: Session active. Launching Dashboard...");
            if (user.role === 'admin' || user.id === 'vijay_master') {
                AdminEngine.init(true);
            } else {
                UIEngine.init();
            }
        } else {
            console.log("App: No session. Loading Auth Layer...");
            AuthEngine.init();
        }
    }
};

// Launch
window.addEventListener('DOMContentLoaded', () => App.init());
