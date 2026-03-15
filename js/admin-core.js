import { db, auth } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const AdminCore = {
    init: function() {
        console.log("Engine Booting...");
        
        onAuthStateChanged(auth, async (user) => {
            const statusEl = document.getElementById('auth-status');
            
            if (user) {
                console.log("User detected:", user.uid);
                
                // Fetch the user document
                const userDoc = await getDoc(doc(db, "users", user.uid));
                
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    console.log("User Data found:", data);

                    if (data.role === 'admin') {
                        if(statusEl) statusEl.innerText = "SUPER ADMIN: " + (data.name || "Vijay");
                        this.renderDashboard();
                    } else {
                        alert("ACCESS DENIED: Your role is '" + data.role + "'. Only Admins allowed.");
                        window.location.href = "login.html";
                    }
                } else {
                    // This is the most likely reason for the bounce
                    alert("SECURITY: UID not found in Firestore. \n\nCopy this UID: " + user.uid);
                    window.location.href = "login.html";
                }
            } else {
                console.log("No session found. Redirecting to login.");
                window.location.href = "login.html";
            }
        });
    },

    switchTab: function(tab) {
        if (tab === 'dashboard') this.renderDashboard();
        // Add other tabs here later
    },

    renderDashboard: function() {
        const container = document.getElementById('content-area');
        if(!container) return;

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Intelligence</div>
                    <div class="text-3xl font-black mt-1">Udaipur Live</div>
                </div>
            </div>
            <div id="admin_map" class="h-96 w-full rounded-2xl shadow-sm border bg-slate-100"></div>
        `;
        
        // Initialize Map
        setTimeout(() => {
            const map = L.map('admin_map').setView([24.5854, 73.7125], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }, 100);
    }
};

window.AdminCore = AdminCore;
AdminCore.init();
