import { db, auth } from './firebase-config.js';
import { 
    collection, getDocs, doc, setDoc, getDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const AdminCore = {
    init: function() {
        console.log("Intelligence Engine: Booting...");
        onAuthStateChanged(auth, async (user) => {
            const statusEl = document.getElementById('auth-status');
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().role === 'admin') {
                    statusEl.innerText = "SUPER ADMIN: " + userDoc.data().name;
                    this.renderDashboard();
                } else {
                    statusEl.innerText = "UID NOT REGISTERED: " + user.uid;
                }
            } else {
                statusEl.innerText = "NO SESSION: Please Login";
                // Only redirect if we are not on the login page
                if(!window.location.href.includes('login.html')) {
                    window.location.href = 'login.html';
                }
            }
        });
    },

    switchTab: function(tab) {
        console.log("Switching Tab to:", tab);
        if (tab === 'dashboard') this.renderDashboard();
        if (tab === 'staff') this.renderStaffMgmt();
        if (tab === 'materials') this.renderMaterialsMgmt();
        if (tab === 'monitoring') this.renderMonitoring();
    },

    renderDashboard: async function() {
        const container = document.getElementById('content-area');
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                    <div class="text-xs font-bold text-slate-400 uppercase">Total Intelligence Pings</div>
                    <div id="total-count" class="text-3xl font-black mt-1">...</div>
                </div>
            </div>
            <div id="admin_map" class="h-96 w-full rounded-2xl shadow-sm border bg-slate-100"></div>
        `;
        this.loadMap();
    },

    loadMap: function() {
        const map = L.map('admin_map').setView([24.5854, 73.7125], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    },

    renderStaffMgmt: function() {
        document.getElementById('content-area').innerHTML = `
            <div class="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 class="font-bold mb-4">Authorize Field Staff</h2>
                <div class="flex gap-4">
                    <input type="text" id="s_id" placeholder="Staff ID" class="border p-2 rounded flex-1">
                    <button onclick="AdminCore.saveStaff()" class="bg-slate-900 text-white px-6 py-2 rounded">Authorize</button>
                </div>
            </div>
        `;
    },

    saveStaff: async function() {
        const id = document.getElementById('s_id').value;
        await setDoc(doc(db, "users", id), { role: 'staff', createdAt: serverTimestamp() });
        alert("Staff Authorized!");
    },

    renderMaterialsMgmt: function() {
        document.getElementById('content-area').innerHTML = `
            <div class="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 class="font-bold mb-4">Material Intelligence</h2>
                <input type="text" id="m_name" placeholder="Brand Name" class="border p-2 rounded w-full mb-4">
                <button onclick="AdminCore.saveMaterial()" class="bg-emerald-600 text-white w-full py-3 rounded font-bold">Add Brand</button>
            </div>
        `;
    },

    saveMaterial: async function() {
        const name = document.getElementById('m_name').value;
        await setDoc(doc(db, "brands", name.toLowerCase()), { name: name });
        alert("Material Added!");
    },

    renderMonitoring: function() {
        document.getElementById('content-area').innerHTML = `<div class="p-10 text-center">Monitoring Live Feed Coming Soon...</div>`;
    }
};

window.AdminCore = AdminCore;
AdminCore.init();
