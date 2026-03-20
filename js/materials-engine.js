/**
 * NIRMANSUTRA MATERIAL ENGINE v3.0 (Hierarchy Enabled)
 * Safe Upgrade: Compatible with core-engine.js cloud sync
 */

// =======================
// 1. MATERIAL DATA (INDIA)
// =======================
const MATERIALS = {
    "Cement": {
        varieties: ["OPC 43","OPC 53","PPC","PSC","White Cement"],
        brands: ["ACC","UltraTech","Ambuja","JK Lakshmi","Dalmia","Birla","Wonder","Shree","Ramco","Nuvoco"]
    },
    "TMT Steel": {
        varieties: ["Fe415","Fe500","Fe550D","Fe600"],
        brands: ["Tata Tiscon","JSW","SAIL","Kamdhenu","Jindal","Rathi","Shyam","SRMB","Vizag","Electrosteel"]
    },
    "Sand": {
        varieties: ["River Sand","M-Sand","Plaster Sand"],
        brands: ["Local","Robo Sand","Thriveni","Stona","VRG","Puzzolana","Propel","UltraTech","Ecomix","Premium"]
    },
    "Aggregates": {
        varieties: ["10mm","20mm","40mm"],
        brands: ["Local Crusher","Puzzolana","Propel","Metso","Sandvik","UltraTech","VRG","Thriveni","Stona","Tata"]
    },
    "Masonry Stones": {
        varieties: ["Granite","Sandstone","Limestone"],
        brands: ["Local Quarry","Rajasthan Stone","Stona","Pokarna","Aditya","Classic","Glittek","Regatta","Aro","South India"]
    },
    "Bricks": {
        varieties: ["Red Clay","Fly Ash","AAC Blocks"],
        brands: ["Local Kiln","ACC","UltraTech","Magicrete","Nuvoco","JK","Birla","Dalmia","Eco Brick","Green Brick"]
    }
};

// =======================
// 2. UI INITIALIZATION
// =======================
const container = document.getElementById("materialsContainer");

Object.keys(MATERIALS).forEach(mat => {

    const safeMat = mat.replace(/\s/g,'');

    const div = document.createElement("div");

    div.innerHTML = `
        <label class="material-btn flex items-center gap-2">
            <input type="checkbox" onchange="toggleMaterial('${safeMat}')">
            ${mat}
        </label>

        <div id="mat_${safeMat}" class="hidden pl-2"></div>
    `;

    container.appendChild(div);
});

// =======================
// 3. MATERIAL TOGGLE
// =======================
function toggleMaterial(matId){

    const container = document.getElementById("mat_" + matId);
    const matName = Object.keys(MATERIALS).find(m => m.replace(/\s/g,'') === matId);

    // Collapse if already open
    if(container.innerHTML !== ""){
        container.innerHTML = "";
        return;
    }

    // Expand varieties
    container.innerHTML = MATERIALS[matName].varieties.map((v,i)=>{

        const vId = `${matId}_v_${i}`;

        return `
            <div class="ml-2 mt-2">
                <label class="flex items-center gap-2 font-bold">
                    <input type="checkbox" onchange="toggleVariety('${matId}',${i})">
                    ${v}
                </label>

                <div id="${vId}" class="hidden ml-4"></div>
            </div>
        `;
    }).join("");
}

// =======================
// 4. VARIETY TOGGLE
// =======================
function toggleVariety(matId,index){

    const matName = Object.keys(MATERIALS).find(m => m.replace(/\s/g,'') === matId);
    const variety = MATERIALS[matName].varieties[index];
    const vId = `${matId}_v_${index}`;

    const container = document.getElementById(vId);

    // Collapse if already open
    if(container.innerHTML !== ""){
        container.innerHTML = "";
        return;
    }

    // Expand brands
    container.innerHTML = MATERIALS[matName].brands.map(b => `
        <label class="flex items-center gap-2 text-sm">
            <input type="checkbox"
                   class="data-brand"
                   data-mat="${matName}"
                   data-parent="${variety}"
                   value="${b}"
                   onclick="if(window.refreshTrackingID) window.refreshTrackingID()">
            ${b}
        </label>
    `).join("");
}
