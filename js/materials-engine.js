const container = document.getElementById("materialsContainer");

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

    let varieties = MATERIALS[mat].varieties;
    let brands = MATERIALS[mat].brands;

    el.innerHTML = `
      <div class="sub-section">
        <b>Varieties</b>
        ${varieties.map(v=>`<div><input type="checkbox"> ${v}</div>`).join("")}
      </div>

      <div class="sub-section">
        <b>Brands</b>
        ${brands.map(b=>`<div><input type="checkbox"> ${b}</div>`).join("")}
      </div>
    `;

  } else {
    el.classList.add("hidden");
  }
}
