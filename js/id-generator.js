// js/id-generator.js

/**
 * Generates a Smart ID: RJ-UDR-[Type][Material]-[Serial]
 * @param {string} supplierType - "Retailer" or "Wholesaler"
 * @param {string} activeMaterial - The material name (Cement, Sand, etc.)
 * @param {number} currentCount - Current total entries from Firebase
 */
export function generateSmartID(supplierType, activeMaterial, currentCount) {
    const state = "RJ";
    const dist = "UDR"; // Udaipur
    
    // 1. Get Type Code
    const typeCode = supplierType === "Wholesaler" ? "W" : "R";

    // 2. Get Material Code (The 6 Core Materials)
    let matCode = "X"; // Default for Mixed/None
    const mat = activeMaterial.toLowerCase();

    if (mat.includes("cement")) matCode = "C";
    else if (mat.includes("tmt") || mat.includes("steel")) matCode = "T";
    else if (mat.includes("sand")) matCode = "S";
    else if (mat.includes("aggregate")) matCode = "A";
    else if (mat.includes("stone")) matCode = "O";
    else if (mat.includes("brick")) matCode = "B";

    // 3. Format Serial (e.g., 001, 042)
    const serial = String(currentCount + 1).padStart(3, '0');

    // 4. Return Final String: RJ-UDR-RC-001
    return `${state}-${dist}-${typeCode}${matCode}-${serial}`;
}
