/**
 * NIRMANSUTRA MASTER MATERIALS ENGINE
 * Handles Brand Registry, Category Logic, and UI Injection
 */

const MaterialsEngine = {
    // 1. THE CATEGORIES (World Class Standard)
    categories: ["Cement", "Steel", "Sand", "Aggregates", "Masonry", "Bricks"],

    // 2. FETCH & SYNC BRANDS
    // This looks at your "brands" collection in Firestore
    syncBrands: function(callback) {
        db.collection("brands").orderBy("name").onSnapshot(snap => {
            const brands = [];
            snap.forEach(doc => {
                brands.push({ id: doc.id, ...doc.data() });
            });
            callback(brands);
        }, err => console.error("Materials Sync Error:", err));
    },

    // 3. ADMIN: ADD NEW BRAND
    addBrand: async function(name, category) {
        if(!name || !category) return alert("Missing Brand Details");
        try {
            await db.collection("brands").add({
                name: name,
                category: category,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (e) {
            console.error("Add Brand Error:", e);
            return false;
        }
    },

    // 4. ADMIN: DELETE BRAND
    deleteBrand: async function(id) {
        if(confirm("Remove this brand from the global registry?")) {
            await db.collection("brands").doc(id).delete();
        }
    },

    // 5. UI: RENDER FOR SURVEY (Dynamic Checkboxes)
    renderSurveyUI: function(containerId, brands) {
        const container = document.getElementById(containerId);
        if(!container) return;

        container.innerHTML = ""; // Clear old
        this.categories.forEach(cat => {
            const catBrands = brands.filter(b => b.category === cat);
            if(catBrands.length > 0) {
                let html = `
                <div class="mb-4">
                    <h4 class="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">${cat}</h4>
                    <div class="grid grid-cols-2 gap-2">`;
                
                catBrands.forEach(brand => {
                    html += `
                    <label class="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 cursor-pointer">
                        <input type="checkbox" name="material_brands" value="${brand.name}" class="accent-orange-500">
                        <span class="text-xs font-semibold text-gray-700">${brand.name}</span>
                    </label>`;
                });
                
                html += `</div></div>`;
                container.innerHTML += html;
            }
        });
    }
};
