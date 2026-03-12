function renderMaterials(){

let html=""

materials.forEach(m=>{

html+=`

<label>
<input type="checkbox" value="${m}">
${m}
</label>

`

})

document.getElementById("materials_list").innerHTML=html

}
function renderFleet(){

let html=""

fleetTypes.forEach(f=>{

html+=`

<label>
<input type="checkbox" value="${f}">
${f}
</label>

`

})

document.getElementById("fleet_list").innerHTML=html

}
