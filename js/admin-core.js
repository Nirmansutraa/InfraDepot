/**
 * INFRA DEPOT - MASTER ADMIN CORE v3.5
 * MISSION: No Simplification. Full Intelligence Traceability.
 */
import { db, auth } from './firebase-config.js';
import { 
    collection, getDocs, doc, setDoc, getDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const AdminCore = {
    init: function() {
        console.log("Engine Booting...");
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Identity Detected:", user.uid);
                const userDoc = await getDoc(doc(db, "users", user.uid));
                
                if (userDoc.exists() && userDoc.data().role === 'admin') {
                    document.getElementById('auth-status').innerText = "SUPER ADMIN: " + userDoc.data().name;
                    this.renderDashboard();
                } else {
                    alert("SECURITY: UID " + user.uid + " is not an Admin in Firestore.");
                }
            } else {
                console.log("No active session. Waiting for login.");
            }
        });
    },

    // --- DASHBOARD MODULE ---
    renderDashboard: async function() {
        const container = document.getElementById('content-area');
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-8 rounded-3xl shadow-sm border-l-8 border-indigo-600">
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Intelligence</div>
                    <div id="stat_total" class="text-4xl font-black text-slate-900 mt-2">Loading...</div>
                </div>
                <div class="bg-white p-8 rounded-3xl shadow-sm border-l-8 border-emerald-500">
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Reach</div>
                    <div class="text-4xl font-black text-slate-900 mt-2">Udaipur</div>
                </div>
            </div>
            <div id="admin_map" class="h-[500px] w-full rounded-3xl shadow-sm border border-slate-100 bg-slate-200"></div>
        `;
        
        this.loadMapAndData();
    },

    loadMapAndData: async function() {
        // Initialize Map
        const map = L.map('admin_map').setView([24.5854, 73.7125], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

        // Fetch Field Data
        const snap = await getDocs(collection(db, "suppliers"));
        document.getElementById('stat_total').innerText = snap.size + " Shops Mapped";
        
        snap.forEach(docSnap => {
            const d = docSnap.data();
            if(d.location) {
                L.marker([d.location.lat, d.location.lng])
                 .addTo(map)
                 .bindPopup(`<b>${d.firmName}</b><br>Staff: ${d.capturedBy}`);
            }
        });
    },

    switchTab: function(tab) {
        if (tab === 'dashboard') this.renderDashboard();
        if (tab === 'staff') this.renderStaffMgmt();
        if (tab === 'materials') this.renderMaterialsMgmt();
    }
};

window.AdminCore = AdminCore;
AdminCore.init();
