const container = document.getElementById("materialsContainer");

// 🔒 No conflict with core-engine
// This system feeds `.data-brand` which cloud sync already uses

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

function toggleMaterial(matId){

  const container = document.getElementById("mat_" + matId);
  const matName = Object.keys(MATERIALS).find(m => m.replace(/\s/g,'') === matId);

  if(container.innerHTML !== ""){
    container.innerHTML = "";
    return;
  }

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

function toggleVariety(matId,index){

  const matName = Object.keys(MATERIALS).find(m => m.replace(/\s/g,'') === matId);
  const variety = MATERIALS[matName].varieties[index];
  const vId = `${matId}_v_${index}`;

  const container = document.getElementById(vId);

  if(container.innerHTML !== ""){
    container.innerHTML = "";
    return;
  }

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
