export const MaterialIntelligence = {
    // Top-tier mapping logic
    hierarchy: {
        "Cement": {
            varieties: ["OPC 53", "PPC", "White Cement"],
            brands: ["UltraTech", "Ambuja", "ACC", "Shree"]
        },
        "Steel": {
            varieties: ["TMT 500D", "CRS", "Structural"],
            brands: ["Tata Tiscon", "JSW Neosteel", "SAIL"]
        }
    },

    saveNewBrand: async function(material, variety, brandName) {
        // Firestore logic to add to 'brands' collection
    }
};
