/**
 * INFRA DEPOT - ADMIN CORE ENGINE
 */
import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const AdminCore = {
    init: async function() {
        console.log("Admin Core Booting...");
        this.initMap();
        this.fetchDashboardData();
    },

    initMap: function() {
        this.map = L.map('admin_map').setView([24.5854, 73.7125], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.map);
    },

    fetchDashboardData: async function() {
        try {
            const querySnapshot = await getDocs(collection(window.db, "surveys"));
            const feed = document.getElementById('survey_feed');
            const uniqueStaff = new Set();
            
            document.getElementById('stat_surveys').innerText = querySnapshot.size;
            
            let html = "";
            querySnapshot.forEach(docSnap => {
                const data = docSnap.data();
                const id = docSnap.id;
                if(data.staffId) uniqueStaff.add(data.staffId);

                // Add to Map
                if(data.location && typeof data.location.lat === 'number') {
                    L.marker([data.location.lat, data.location.lng])
                     .addTo(this.map)
                     .bindPopup(`<b>${data.firmName}</b>`);
                }

                html += `
                    <div style="padding:15px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:bold; font-size:14px;">${data.firmName || 'Unnamed'}</div>
                            <small style="color:#6b7280;">${data.address || 'Location Captured'}</small>
                        </div>
                        <button onclick="window.deleteEntry('${id}')" style="background:none; border:none; cursor:pointer; font-size:18px;">🗑️</button>
                    </div>
                `;
            });

            document.getElementById('stat_staff').innerText = uniqueStaff.size;
            feed.innerHTML = html || '<div style="padding:20px; text-align:center;">No data found.</div>';

            window.deleteEntry = async (id) => {
                if(confirm("Delete this entry?")) {
                    await deleteDoc(doc(window.db, "surveys", id));
                    location.reload();
                }
            };

        } catch (e) {
            console.error("Dashboard Error:", e);
        }
    }
};

AdminCore.init();
