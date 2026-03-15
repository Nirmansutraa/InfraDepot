/**
 * INFRA DEPOT - MATERIAL INTELLIGENCE MODULE
 * [cite: 53-54, 287-289, 419-427]
 */
import { db } from './firebase-config.js'; // Ensure the dot and slash are here
import { doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const MaterialIntel = {
    // [cite: 288-289, 427]
    addBrand: async function(materialName, varietyName, brandName) {
        try {
            const id = `${materialName}_${brandName}`.toLowerCase().replace(/\s/g, '_');
            await setDoc(doc(db, "brands", id), {
                parentMaterial: materialName.toLowerCase(),
                parentVariety: varietyName.toLowerCase(),
                name: brandName,
                status: "active"
            });
            return true;
        } catch (error) {
            console.error("Error adding brand:", error);
            return false;
        }
    }
};

window.MaterialIntel = MaterialIntel;
