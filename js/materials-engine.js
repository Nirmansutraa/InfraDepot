const container = document.getElementById("materialsContainer");

let selectedMaterials = {};

Object.keys(MATERIALS).forEach(mat => {

  const div = document.createElement("div");
  div.className = "material";

  div.innerHTML = `
    <label>
      <input type="checkbox" onchange="toggleMaterial('${mat}')"> ${mat}
    </label>
    <div id="${mat}" class="hidden"></div>
  `;

  container.appendChild(div);
});

function toggleMaterial(mat){

  const el = document.getElementById(mat);

  if(el.classList.contains("hidden")){

    el.classList.remove("hidden");

    const varieties = MATERIALS[mat].varieties;

    el.innerHTML = varieties.map((v,i)=>`
      <div class="variety-card">
        <label>
          <input type="checkbox" onchange="selectVariety('${mat}',${i})">
          ${v.name}
        </label>

        <div class="price">
          ${formatPrice(v.price,v.unit)}
          (Avg: ₹${calculateAvgPrice(v.price)})
        </div>

        <div class="meta">
          Availability: ${v.availability} |
          Supplier: ${v.supplier.join(",")}
        </div>
      </div>
    `).join("");

  } else {
    el.classList.add("hidden");
    delete selectedMaterials[mat];
  }
}

function selectVariety(mat,index){

  const v = MATERIALS[mat].varieties[index];

  if(!selectedMaterials[mat]) selectedMaterials[mat]=[];

  selectedMaterials[mat].push({
    name:v.name,
    price:v.price,
    unit:v.unit,
    supplier:v.supplier
  });
}
