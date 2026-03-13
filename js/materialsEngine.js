function loadMaterialSelector(){

const container = document.getElementById("material_selector")

if(!container) return

container.innerHTML=""

Object.keys(MATERIALS_DB).forEach(material=>{

let block=document.createElement("div")
block.className="material-block"

let title=document.createElement("div")
title.className="material-title"
title.innerText=material

let variety=document.createElement("select")
variety.className="input material"

MATERIALS_DB[material].varieties.forEach(v=>{
let opt=document.createElement("option")
opt.value=v
opt.text=v
variety.appendChild(opt)
})

let brand=document.createElement("select")
brand.className="input"

MATERIALS_DB[material].brands.forEach(b=>{
let opt=document.createElement("option")
opt.value=b
opt.text=b
brand.appendChild(opt)
})

block.appendChild(title)
block.appendChild(variety)
block.appendChild(brand)

container.appendChild(block)

})

}
