/**
 * INFRA DEPOT - MASTER CONTROLLER v1.6
 */
// The ?v=1 trick forces the browser to load the NEWEST version
import { AuthEngine } from './auth.js?v=1';
import { AdminEngine } from './admin.js?v=1';
import { UIEngine } from './ui.js?v=1';

const App = {
    init: function() {
        console.log("InfraDepot: System Booting...");
        
        // Clean Slate
        document.body.innerHTML = '<div id="main_viewport"></div>';

        const user = JSON.parse(localStorage.getItem('infra_user'));

        if (user) {
            if (user.role === 'admin' || user.id === 'vijay_master') {
                AdminEngine.init(true);
            } else {
                UIEngine.init();
            }
        } else {
            AuthEngine.init();
        }
    }
};

window.addEventListener('DOMContentLoaded', () => App.init());
