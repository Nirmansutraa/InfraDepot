import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const AdminCore = {
    init: function() {
        this.checkAccess();
        this.switchTab('dashboard');
    },

    checkAccess: function() {
        const user = JSON.parse(localStorage.getItem('infra_user'));
        if (!user || user.role !== 'admin') {
            window.location.href = 'index.html';
        }
    },

    switchTab: async function(tab) {
        const container = document.getElementById('content-area');
        container.innerHTML = `<div class="loader">Loading intelligence...</div>`;

        switch(tab) {
            case 'dashboard':
                this.renderDashboard(container);
                break;
            case 'suppliers':
                this.renderSuppliers(container);
                break;
            case 'materials':
                this.renderMaterials(container);
                break;
            case 'staff':
                this.renderStaff(container);
                break;
        }
    },

    renderDashboard: async function(container) {
        // Fetch Real Stats from Firestore
        const surveys = await getDocs(collection(db, "surveys"));
        const users = await getDocs(collection(db, "users"));

        container.innerHTML = `
            <div class="content-section">
                <div class="stats-grid">
                    <div class="stat-card"><h3>Suppliers Mapped</h3><p>${surveys.size}</p></div>
                    <div class="stat-card"><h3>Field Intelligence</h3><p>${surveys.size * 4}</p></div>
                    <div class="stat-card"><h3>Active Staff</h3><p>${users.size}</p></div>
                    <div class="stat-card"><h3>Network Coverage</h3><p>Udaipur</p></div>
                </div>

                <div class="grid-2-col" style="display:grid; grid-template-columns: 2fr 1fr; gap:25px;">
                    <div class="card">
                        <div class="section-label">LIVE SUPPLIER NETWORK</div>
                        <div id="admin-map" style="height:400px; border-radius:8px; margin-top:15px;"></div>
                    </div>
                    <div class="card">
                        <div class="section-label">RECENT ACTIVITY</div>
                        <div id="activity-feed"></div>
                    </div>
                </div>
            </div>
        `;
        this.initAdminMap();
    },

    initAdminMap: function() {
        const map = L.map('admin-map').setView([24.5854, 73.7125], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        // Logic to pull supplier coords and add markers goes here
    }
};

AdminCore.init();
window.AdminCore = AdminCore;
