/**
 * INFRA DEPOT - MASTER ADMIN CORE v3.1
 * Purpose: Unified Dashboard, Staff Mgmt, and Material Intelligence
 */
import { db } from './firebase-config.js';
import { 
    collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const AdminCore = {
    init: function() {
        console.log("Admin Intelligence Engine: Online");
        this.renderDashboard();
    },

    // --- MODULE NAVIGATION [cite: 201-208] ---
    switchTab: function(tab) {
        const container = document.getElementById('content-area');
        container.innerHTML = `<div class="p-10 text-center opacity-50">Syncing Cloud Data...</div>`;
        
        if (tab === 'dashboard') this.renderDashboard();
        if (tab === 'staff') this.renderStaffMgmt();
        if (tab === 'materials') this.renderMaterialsMgmt();
        if (tab === 'monitoring') this.renderFieldMonitoring();
    },

    // --- STAFF MANAGEMENT [cite: 52, 135-136, 325-326] ---
    renderStaffMgmt: async function() {
        const container = document.getElementById('content-area');
        container.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-sm mb-6 border-2 border-blue-50">
                <h3 class="font-bold text-gray-800 mb-4 uppercase text-xs tracking-widest">➕ Create Staff Access</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" id="new_staff_id" placeholder="Staff ID (e.g. FS101)" class="p-3 border rounded-lg bg-gray-50">
                    <input type="text" id="new_staff_pass" placeholder="Password" class="p-3 border rounded-lg bg-gray-50">
                    <button id="save-staff-btn" class="bg-blue-600 text-white font-bold rounded-lg p-3 hover:bg-blue-700">Add to Team</button>
                </div>
            </div>
            <div id="user_list" class="bg-white rounded-xl shadow-sm divide-y"></div>
        `;

        document.getElementById('save-staff-btn').addEventListener('click', () => this.saveUser());
        this.loadUsers();
    },

    saveUser: async function() {
        const id = document.getElementById('new_staff_id').value.trim();
        const pass = document.getElementById('new_staff_pass').value.trim();
        if(!id || !pass) return alert("Fill all fields");

        try {
            await setDoc(doc(db, "users", id), { password: pass, role: 'staff', createdAt: Date.now() });
            alert("✅ Staff access granted!");
            this.renderStaffMgmt();
        } catch (e) { alert("Error: " + e.message); }
    },

    loadUsers: async function() {
        const snap = await getDocs(collection(db, "users"));
        let html = "";
        snap.forEach(u => {
            html += `<div class="p-4 flex justify-between"><span><b>${u.id}</b></span><button onclick="AdminCore.deleteUser('${u.id}')" class="text-red-400">🗑️</button></div>`;
        });
        document.getElementById('user_list').innerHTML = html || `<div class="p-10 text-center">No staff yet.</div>`;
    },

    // --- MATERIAL INTELLIGENCE [cite: 53-54, 287-290, 419-427] ---
    renderMaterialsMgmt: function() {
        const container = document.getElementById('content-area');
        container.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-sm mb-6 border-2 border-emerald-50">
                <h3 class="font-bold text-gray-800 mb-4 uppercase text-xs tracking-widest">🧱 Supply Chain Control</h3>
                <div class="space-y-4">
                    <div>
                        <label class="text-[10px] text-gray-400 font-bold">SELECT CATEGORY [cite: 421-425]</label>
                        <select id="mat-category" class="w-full p-3 border rounded-lg bg-gray-50 mt-1">
                            <option value="cement">Cement</option>
                            <option value="steel">Steel</option>
                            <option value="sand">Sand</option>
                            <option value="stone">Stone/Aggregates</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] text-gray-400 font-bold">BRAND NAME [cite: 289, 427]</label>
                        <input type="text" id="brand-name" placeholder="e.g. UltraTech, Ambuja, TATA Tiscon" class="w-full p-3 border rounded-lg bg-gray-50 mt-1">
                    </div>
                    <button id="save-brand-btn" class="w-full bg-slate-900 text-white font-bold rounded-lg p-4 hover:bg-black transition-all">
                        Add to Global Intelligence List
                    </button>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm text-center">
                <p class="text-xs text-gray-400">Brands added here will automatically appear in the staff capture form[cite: 177, 354].</p>
            </div>
        `;

        // The specific fix for your 'Add Material' button
        document.getElementById('save-brand-btn').addEventListener('click', () => this.saveBrand());
    },

    saveBrand: async function() {
        const category = document.getElementById('mat-category').value;
        const brand = document.getElementById('brand-name').value.trim();

        if(!brand) return alert("⚠️ Please enter a Brand Name.");

        try {
            // [cite: 278-282, 288-289]
            const brandId = `${category}_${brand.toLowerCase().replace(/\s/g, '_')}`;
            await setDoc(doc(db, "brands", brandId), {
                parentMaterial: category,
                name: brand,
                status: "active",
                addedAt: serverTimestamp()
            });

            alert(`✅ ${brand} added to ${category} list!`);
            document.getElementById('brand-name').value = ""; // Clear input
        } catch (e) {
            console.error(e);
            alert("❌ Database Error: " + e.message);
        }
    },

    // --- DASHBOARD [cite: 121-124, 314-318] ---
    renderDashboard: async function() {
        const container = document.getElementById('content-area');
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
                    <div class="text-xs font-bold text-gray-400 uppercase">Total Suppliers</div>
                    <div id="count-total" class="text-3xl font-black tracking-tighter">0</div>
                </div>
            </div>
            <div id="admin_map" class="mt-6 h-96 rounded-2xl shadow-sm bg-gray-100 border"></div>
        `;
        this.initMap();
    },

    initMap: function() {
        this.map = L.map('admin_map').setView([24.5854, 73.7125], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    }
};

window.AdminCore = AdminCore;
AdminCore.init();
