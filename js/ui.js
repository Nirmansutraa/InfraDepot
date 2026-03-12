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
