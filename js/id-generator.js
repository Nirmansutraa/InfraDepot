// js/id-generator.js

/**
 * Generates a Smart ID: RJ-UDR-[Type][Material]-[Serial]
 * @param {string} supplierType - "Retailer" or "Wholesaler"
 * @param {any} activeMaterial - The material name (String) or Selection Array
 * @param {number} currentCount - Current total entries from Firebase
 */
export function generateSmartID(supplierType, activeMaterial, currentCount) {
    const state = "RJ";
    const dist = "UDR"; // Udaipur
    
    // 1. Get Type Code
    const typeCode = supplierType === "Wholesaler" ? "W" : "R";

    // 2. Get Material Code (The 6 Core Materials)
    let matCode = "X"; // Default for Mixed/None
    let matSearch = "";

    // MERGE LOGIC: Handle both string inputs and object arrays
    if (Array.isArray(activeMaterial) && activeMaterial.length > 0) {
        // If it's an array, look at the brand/variety of the first item
        matSearch = (activeMaterial[0].brand || activeMaterial[0].variety || "").toLowerCase();
    } else if (typeof activeMaterial === 'string') {
        matSearch = activeMaterial.toLowerCase();
    }

    if (matSearch.includes("cement")) matCode = "C";
    else if (matSearch.includes("tmt") || matSearch.includes("steel")) matCode = "T";
    else if (matSearch.includes("sand")) matCode = "S";
    else if (matSearch.includes("aggregate")) matCode = "A";
    else if (matSearch.includes("stone")) matCode = "O";
    else if (matSearch.includes("brick")) matCode = "B";

    // 3. Format Serial (e.g., 001, 042)
    const serial = String(currentCount + 1).padStart(3, '0');

    // 4. Return Final String: RJ-UDR-RC-001
    return `${state}-${dist}-${typeCode}${matCode}-${serial}`;
}
