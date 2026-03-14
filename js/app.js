/**
 * INFRA DEPOT - MASTER CONTROLLER
 */
import { AuthEngine } from './auth.js';
import { AdminEngine } from './admin.js';
import { UIEngine } from './ui.js';

const App = {
    init: function() {
        console.log("InfraDepot: System Booting...");
        
        // Ensure we have a clean slate to prevent "invisible walls"
        if (!document.getElementById('main_viewport')) {
            document.body.innerHTML = '<div id="main_viewport" style="width:100%; min-height:100vh;"></div>';
        }

        const user = JSON.parse(localStorage.getItem('infra_user'));

        if (user) {
            console.log("App: Session active.");
            if (user.role === 'admin' || user.id === 'vijay_master') {
                AdminEngine.init(true);
            } else {
                UIEngine.init();
            }
        } else {
            console.log("App: Loading Login...");
            AuthEngine.init();
        }
    }
};

window.addEventListener('DOMContentLoaded', () => App.init());
