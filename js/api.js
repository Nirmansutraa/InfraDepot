/**
 * INFRA DEPOT - MASTER STATE CONTROLLER v1.3
 */
import { AuthEngine } from './auth.js';
import { AdminEngine } from './admin.js';
import { UIEngine } from './ui.js';

const App = {
    init: function() {
        // Clear any previous "ghost" layers
        document.body.innerHTML = '<div id="main_viewport"></div>';
        this.render();
    },

    render: function() {
        const viewport = document.getElementById('main_viewport');
        const user = JSON.parse(localStorage.getItem('infra_user'));

        if (user) {
            console.log("App: Session active.");
            // Create a clean container for the App
            viewport.innerHTML = '<div id="app_layer" style="display:block;"></div>';
            
            if (user.role === 'admin' || user.id === 'vijay_master') {
                AdminEngine.init(true);
            } else {
                UIEngine.init();
            }
        } else {
            console.log("App: Loading Login...");
            // Create a clean container for Login
            viewport.innerHTML = '<div id="auth_layer" style="display:block;"></div>';
            AuthEngine.init();
        }
    }
};

window.addEventListener('DOMContentLoaded', () => App.init());
