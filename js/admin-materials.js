/**
 * INFRA DEPOT - MATERIAL INTELLIGENCE MODULE
 * [cite: 53-54, 126, 287-300, 419-439]
 */
import { db } from './firebase-config.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const MaterialIntel = {
    // 1. ADD NEW MATERIAL (e.g., Cement, Steel, Sand) [cite: 53]
    addMaterial: async function(name) {
        const docRef = doc(db, "materials", name.toLowerCase());
        await setDoc(docRef, { 
            name: name,
            active: true,
            createdAt: Date.now()
        });
        console.log(`Material ${name} added to Intelligence Base.`);
    },

    // 2. ADD VARIETY TO MATERIAL (e.g., Cement -> PPC) [cite: 293, 431]
    addVariety: async function(materialName, varietyName) {
        const id = `${materialName}_${varietyName}`.toLowerCase().replace(/\s/g, '_');
        await setDoc(doc(db, "varieties", id), {
            parentMaterial: materialName.toLowerCase(),
            name: varietyName,
            active: true
        });
    },

    // 3. ADD BRAND (e.g., Cement -> PPC -> UltraTech) [cite: 54, 243]
    addBrand: async function(materialName, varietyName, brandName) {
        const id = `${materialName}_${brandName}`.toLowerCase().replace(/\s/g, '_');
        await setDoc(doc(db, "brands", id), {
            parentMaterial: materialName.toLowerCase(),
            parentVariety: varietyName.toLowerCase(),
            name: brandName,
            status: "active" // [cite: 124]
        });
    },

    // 4. LOAD HIERARCHY FOR ADMIN VIEW [cite: 126]
    loadIntelligenceData: async function() {
        const materials = await getDocs(collection(db, "materials"));
        const varieties = await getDocs(collection(db, "varieties"));
        const brands = await getDocs(collection(db, "brands"));
        
        return {
            materials: materials.docs.map(d => d.data()),
            varieties: varieties.docs.map(d => d.data()),
            brands: brands.docs.map(d => d.data())
        };
    }
};

window.MaterialIntel = MaterialIntel;
