/**
 * INFRA DEPOT - ADMIN COMMAND CENTER v3.0
 * Purpose: Unified Dashboard, Team Management, Material Intel & Field Monitoring
 */
import { db } from './firebase-config.js';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { MaterialIntel } from './admin-materials.js';

const AdminCore = {
    init: function() {
        console.log("Admin Command Center: Online");
        this.switchTab('dashboard'); // Default view on load
    },

    // --- NAVIGATION CONTROLLER ---
    switchTab: function(tab) {
        const container = document.getElementById('content-area');
        container.innerHTML = `<div class="p-10 text-center">🔄 Syncing Cloud Intelligence...</div>`;
        
        if (tab === 'dashboard') this.renderDashboard();
        if (tab === 'staff') this.renderStaffMgmt();
        if (tab === 'materials') this.renderMaterialsMgmt();
        if (tab === 'monitoring') this.renderFieldMonitoring();
    },

    // --- TAB 1: MARKET INTELLIGENCE DASHBOARD [cite: 121-126, 314-320] ---
    renderDashboard: async function() {
        const container = document.getElementById('content-area');
        try {
            const snap = await getDocs(collection(db, "suppliers"));
            const users = await getDocs(collection(db, "users"));
            
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                        <small class="text-gray-500 font-bold uppercase text-[10px]">Total Suppliers</small>
                        <div class="text-3xl font-black">${snap.size}</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-600">
                        <small class="text-gray-500 font-bold uppercase text-[10px]">Active Staff</small>
                        <div class="text-3xl font-black">${users.size}</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-600">
                        <small class="text-gray-500 font-bold uppercase text-[10px]">Market Reach</small>
                        <div class="text-3xl font-black">Udaipur</div>
                    </div>
                </div>
                <div class="bg-white p-2 rounded-xl shadow-sm mb-6">
                    <div id="admin_map" style="height:400px; border-radius:10px;"></div>
                </div>
            `;
            
            this.initMap();
            snap.forEach(docSnap => {
                const data = docSnap.data();
                if(data.location && typeof data.location.lat === 'number') {
                    L.marker([data.location.lat, data.location.lng])
                     .addTo(this.map)
                     .bindPopup(`<b>${data.firmName}</b><br>${data.phone}`);
                }
            });
        } catch (e) { console.error(e); }
    },

    initMap: function() {
        this.map = L.map('admin_map').setView([24.5854, 73.7125], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.map);
    },

    // --- TAB 2: STAFF & ACCESS MANAGEMENT [cite: 135-136, 325-326] ---
    renderStaffMgmt: async function() {
        const container = document.getElementById('content-area');
        container.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
                <h3 class="font-bold text-gray-800 mb-4">➕ Create Staff Access</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" id="new_id" placeholder="Staff ID (e.g. FS101)" class="p-3 border rounded-lg bg-gray-50">
                    <input type="text" id="new_pass" placeholder="Password" class="p-3 border rounded-lg bg-gray-50">
                    <button onclick="AdminCore.saveUser()" class="bg-blue-600 text-white font-bold rounded-lg p-3">Add to Team</button>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="p-4 border-bottom bg-gray-50 font-bold text-xs uppercase text-gray-500">Registered Staff</div>
                <div id="user_list"></div>
            </div>
        `;
        this.loadUsers();
    },

    saveUser: async function() {
        const id = document.getElementById('new_id').value.trim();
        const pass = document.getElementById('new_pass').value.trim();
        if(!id || !pass) return alert("All fields required");
        await setDoc(doc(db, "users", id), { password: pass, role: 'staff' });
        alert("Staff Added Successfully");
        this.renderStaffMgmt();
    },

    loadUsers: async function() {
        const snap = await getDocs(collection(db, "users"));
        let html = "";
        snap.forEach(u => {
            html += `<div class="p-4 border-b flex justify-between items-center">
                <span><b>${u.id}</b> <small class="text-gray-400">(${u.data().password})</small></span>
                <button onclick="AdminCore.deleteUser('${u.id}')" class="text-red-500">🗑️</button>
            </div>`;
        });
        document.getElementById('user_list').innerHTML = html;
    },

    deleteUser: async function(id) {
        if(confirm(`Delete access for ${id}?`)) {
            await deleteDoc(doc(db, "users", id));
            this.renderStaffMgmt();
        }
    },

    // --- TAB 3: MATERIAL INTELLIGENCE CONTROL [cite: 127, 287-289, 426-427] ---
    renderMaterialsMgmt: async function() {
        const container = document.getElementById('content-area');
        container.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
                <h3 class="font-bold text-gray-800 mb-4">🧱 Supply Chain Control</h3>
                <div class="space-y-4">
                    <select id="mat-parent" class="w-full p-3 border rounded-lg bg-gray-50">
                        <option value="cement">Cement</option>
                        <option value="steel">Steel</option>
                        <option value="sand">Sand</option>
                    </select>
                    <input type="text" id="brand-name" placeholder="Brand Name (e.g. UltraTech)" class="w-full p-3 border rounded-lg bg-gray-50">
                    <button onclick="AdminCore.saveBrand()" class="w-full bg-slate-900 text-white font-bold rounded-lg p-4">Add to Global List</button>
                </div>
            </div>
            <div id="material-list" class="bg-white rounded-xl shadow-sm p-4 text-xs text-gray-500">
                Brands added here will automatically appear in the Field Survey App.
            </div>
        `;
    },

    saveBrand: async function() {
        const mat = document.getElementById('mat-parent').value;
        const brand = document.getElementById('brand-name').value;
        if(!brand) return alert("Enter brand name");
        await MaterialIntel.addBrand(mat, "general", brand);
        alert("Supply Intelligence Updated!");
        document.getElementById('brand-name').value = "";
    },

    // --- TAB 4: FIELD VISIT MONITORING [cite: 121, 319, 369, 470-474] ---
    renderFieldMonitoring: async function() {
        const container = document.getElementById('content-area');
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="p-4 bg-slate-900 text-white font-bold">🗺️ REAL-TIME FIELD LOGS</div>
                <div id="visit-logs" class="divide-y"></div>
            </div>
        `;
        
        const snap = await getDocs(collection(db, "suppliers"));
        let html = "";
        snap.forEach(docSnap => {
            const data = docSnap.data();
            const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString() : 'Recent';
            html += `
                <div class="p-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                        <div class="font-bold text-sm text-gray-800">${data.firmName}</div>
                        <div class="text-[10px] text-gray-500 uppercase tracking-widest">STAFF ID: ${data.capturedBy || 'N/A'}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs font-bold text-blue-600">${date}</div>
                        <div class="text-[9px] text-gray-400">GPS ACCURACY: ${data.location?.accuracy || '±15'}m</div>
                    </div>
                </div>
            `;
        });
        document.getElementById('visit-logs').innerHTML = html || `<div class="p-10 text-center">No visits logged today.</div>`;
    }
};

// EXPOSE TO GLOBAL WINDOW
window.AdminCore = AdminCore;
AdminCore.init();
