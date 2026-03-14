/**
 * INFRA DEPOT - CLOUD SYNC ENGINE
 * Fix: Enterprise Data Packaging & Sync
 */

const SupplierEngine = {
    // 00 Dashboard Stats (Simplified for development)
    loadDashboardStats: async function() {
        try {
            const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const snap = await getDocs(collection(window.db, "surveys"));
            const count = snap.size;
            document.getElementById('stat_today').innerText = count;
            document.getElementById('stat_week').innerText = count;
            document.getElementById('stat_month').innerText = count;
            document.getElementById('stat_year').innerText = count;
        } catch (e) { console.warn("Dashboard stats placeholder."); }
    },

    // 01 Data Gathering & Cloud Submission
    syncToCloud: async function() {
        console.log("Enterprise Sync Process Started...");
        const syncBtn = document.getElementById('sync_btn');
        if (syncBtn) {
            syncBtn.innerHTML = "🌀 CONNECTING CLOUD...";
            syncBtn.disabled = true;
        }

        try {
            // Check Firebase availability
            if (!window.db) {
                throw new Error("Cloud connection is offline. Firebase not initialized.");
            }

            // --- 00 Gather Identity Data ---
            const firmName = document.getElementById('f_name')?.value || "Unnamed Firm";
            const ownerName = document.getElementById('o_name')?.value || "N/A";

            // --- 01 Gather Supply Area Data ---
            const fullUdaipurChecked = document.getElementById('area_full')?.checked || false;
            const radius25kmChecked = document.getElementById('area_radius')?.checked || false;

            // Collect Prime Locations (all that are checked)
            const primeLocations = [];
            document.querySelectorAll('.loc-check:checked').forEach(el => primeLocations.push(el.value));

            // --- 02 Gather Material & Brand Data ---
            const materialData = {};
            // Loop through each checked main material checkbox
            document.querySelectorAll('.mat-main-check:checked').forEach(materialCheck => {
                const matName = materialCheck.value;
                materialData[matName] = { 
                    varieties: Array.from(document.querySelectorAll(`.v-check[data-mat="${matName}"]:checked`)).map(el => el.value),
                    brands: Array.from(document.querySelectorAll(`.b-check[data-mat="${matName}"]:checked`)).map(el => el.value)
                };
            });

            // --- 03 Gather Fleet Data (FIXED IDs) ---
            const fleetData = {
                tractor: document.getElementById('fl_tractor')?.innerText || "0",
                mini: document.getElementById('fl_minitruck')?.innerText || "0",
                truck: document.getElementById('fl_truck')?.innerText || "0",
                dumper: document.getElementById('fl_dumper')?.innerText || "0",
                trail: document.getElementById('fl_trailer')?.innerText || "0"
            };

            // --- 04 Finalize Payload ---
            const payload = {
                timestamp: new Date().toISOString(),
                staffId: localStorage.getItem('infra_session') || "GUEST",
                business: {
                    firm: firmName,
                    owner: ownerName,
                    ownerMob: document.getElementById('o_mob')?.value || "",
                    ownerWA: document.getElementById('o_wa')?.value || "",
                    managerMob: document.getElementById('m_mob')?.value || "",
                    managerWA: document.getElementById('m_wa')?.value || ""
                },
                supplyChain: {
                    wholeUdaipur: fullUdaipurChecked,
                    radius25km: radius25kmChecked,
                    primeLocations: primeLocations,
                    materials: materialData
                },
                fleet: fleetData,
                evidence: UIEngine.photos, // Max 10 compressed photos
                address: document.getElementById('form_address')?.value || "GPS Not Captured"
            };

            // --- 05 Submit to Firebase ---
            btn.innerHTML = "🌀 SENDING ENTERPRISE DATA...";
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const docRef = await addDoc(collection(window.db, "surveys"), payload);
            
            console.log("Enterprise Survey Synced. Doc ID:", docRef.id);
            alert("SUCCESS! Enterprise Survey Synced to Cloud.");
            location.reload();

        } catch (error) {
            console.error("Cloud Sync Failed:", error);
            alert("Sync Failed: " + error.message);
            if (syncBtn) {
                syncBtn.innerHTML = "🚀 RETRY FINAL SUBMISSION";
                syncBtn.disabled = false;
            }
        }
    }
};

// CRITICAL: Make the engine visible to the HTML button
window.SupplierEngine = SupplierEngine;
