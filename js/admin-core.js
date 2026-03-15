/**
 * INFRA DEPOT - MASTER INTELLIGENCE ENGINE CORE v3.4
 * FULL COMPLEX LOGIC: Team Management, Material Taxonomy, and Operational Monitoring
 */
import { db, auth } from './firebase-config.js';
import { 
    collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy, getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const AdminCore = {
    init: function() {
        // [cite: 210-215]
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().role === 'admin') {
                    console.log("INTELLIGENCE ACCESS: GRANTED (SUPER ADMIN)");
                    this.renderDashboard();
                } else {
                    alert("SECURITY BREACH: You are logged in but do not have 'admin' privileges in Firestore [cite: 135-138].");
                    window.location.href = "login.html";
                }
            } else {
                window.location.href = "login.html";
            }
        });
    },

    switchTab: function(tab) {
        const container = document.getElementById('content-area');
        container.innerHTML = `<div class="p-10 text-center animate-pulse text-slate-400">Querying Intelligence Matrix...</div>`;
        
        if (tab === 'dashboard') this.renderDashboard();
        if (tab === 'staff') this.renderStaffMgmt();
        if (tab === 'materials') this.renderMaterialsMgmt();
        if (tab === 'monitoring') this.renderFieldMonitoring();
    },

    // --- MODULE: STAFF AUTHORIZATION [cite: 71-75, 212-219, 369] ---
    renderStaffMgmt: async function() {
        document.getElementById('content-area').innerHTML = `
            <div class="bg-white p-8 rounded-3xl shadow-sm mb-8 border border-slate-100">
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Staff Access Control</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input type="text" id="staff_id" placeholder="Staff UID (e.g. FS101)" class="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500">
                    <input type="text" id="staff_pass" placeholder="Access Password" class="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500">
                    <button id="btn-save-staff" class="bg-indigo-600 text-white font-bold p-4 rounded-2xl hover:bg-indigo-700 transition-all">Authorize Staff</button>
                </div>
            </div>
            <div id="staff_list" class="bg-white rounded-3xl shadow-sm divide-y border border-slate-50 overflow-hidden"></div>
        `;
        document.getElementById('btn-save-staff').onclick = () => this.saveStaff();
        this.loadStaff();
    },

    saveStaff: async function() {
        const id = document.getElementById('staff_id').value.trim();
        const pass = document.getElementById('staff_pass').value.trim();
        if(!id || !pass) return alert("Validation Failed: UID and Password required.");

        try {
            await setDoc(doc(db, "users", id), { password: pass, role: 'staff', createdAt: serverTimestamp() });
            alert(`SUCCESS: Staff member ${id} authorized [cite: 216-217].`);
            this.renderStaffMgmt();
        } catch (e) { alert("PERMISSION DENIED: " + e.message); }
    },

    loadStaff: async function() {
        const snap = await getDocs(collection(db, "users"));
        let html = "";
        snap.forEach(u => {
            if(u.data().role === 'staff') {
                html += `<div class="p-6 flex justify-between items-center hover:bg-slate-50">
                    <div class="font-bold text-slate-700">${u.id}</div>
                    <button onclick="AdminCore.deleteUser('${u.id}')" class="text-rose-400 font-bold text-xs uppercase">Revoke Access</button>
                </div>`;
            }
        });
        document.getElementById('staff_list').innerHTML = html || `<div class="p-10 text-center text-slate-300 italic">No staff mapped in intelligence base[cite: 319].</div>`;
    },

    // --- MODULE: MATERIAL TAXONOMY [cite: 53-54, 287-290, 419-427] ---
    renderMaterialsMgmt: function() {
        document.getElementById('content-area').innerHTML = `
            <div class="bg-white p-8 rounded-3xl shadow-sm mb-8 border border-slate-100">
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Supply Chain Intelligence</h3>
                <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-6">
                        <select id="intel_cat" class="p-4 bg-slate-50 border rounded-2xl outline-none">
                            <option value="cement">Cement</option>
                            <option value="steel">Steel</option>
                            <option value="sand">Sand</option>
                        </select>
                        <input type="text" id="intel_brand" placeholder="Brand Name (e.g. UltraTech)" class="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                    <button id="btn-save-intel" class="w-full bg-slate-900 text-white font-bold p-5 rounded-2xl hover:bg-black transition-all">Inject Brand Intelligence</button>
                </div>
            </div>
        `;
        document.getElementById('btn-save-intel').onclick = () => this.saveIntel();
    },

    saveIntel: async function() {
        const cat = document.getElementById('intel_cat').value;
        const brand = document.getElementById('intel_brand').value.trim();
        if(!brand) return alert("Validation Failed: Brand name required[cite: 427].");

        try {
            const intelId = `${cat}_${brand.toLowerCase().replace(/\s/g, '_')}`;
            await setDoc(doc(db, "brands", intelId), { parentMaterial: cat, brandName: brand, status: "verified", updatedAt: serverTimestamp() });
            alert(`SUCCESS: ${brand} injected into ${cat} matrix[cite: 289].`);
            document.getElementById('intel_brand').value = "";
        } catch (e) { alert("PERMISSION DENIED: " + e.message); }
    },

    // --- DASHBOARD & MONITORING [cite: 9, 121-124, 208, 314-320] ---
    renderDashboard: async function() {
        const snap = await getDocs(collection(db, "suppliers"));
        document.getElementById('content-area').innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div class="bg-white p-8 rounded-3xl shadow-sm border-l-8 border-indigo-600">
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Intelligence Mapped</div>
                    <div class="text-4xl font-black text-slate-900 mt-2">${snap.size}</div>
                </div>
            </div>
            <div id="admin_map" class="h-[500px] w-full rounded-3xl shadow-sm border border-slate-50"></div>
        `;
        this.initMap(snap);
    },

    initMap: function(snap) {
        const map = L.map('admin_map').setView([24.5854, 73.7125], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
        snap.forEach(docSnap => {
            const d = docSnap.data();
            if(d.location) L.marker([d.location.lat, d.location.lng]).addTo(map).bindPopup(`<b class="text-indigo-600">${d.firmName}</b>`);
        });
    }
};

window.AdminCore = AdminCore;
AdminCore.init();
