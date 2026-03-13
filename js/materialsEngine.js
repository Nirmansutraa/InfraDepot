function loadMaterialSelector(){

const container = document.getElementById("material_selector")

container.innerHTML = ""

Object.keys(MATERIALS_DB).forEach(material => {

const card = document.createElement("div")
card.style.marginBottom = "12px"

const matTitle = document.createElement("div")
matTitle.innerHTML = "<b>"+material+"</b>"

const varietySelect = document.createElement("select")
varietySelect.style.width="100%"
varietySelect.style.marginBottom="6px"

MATERIALS_DB[material].varieties.forEach(v=>{
const opt=document.createElement("option")
opt.value=v
opt.text=v
varietySelect.appendChild(opt)
})

const brandSelect = document.createElement("select")
brandSelect.style.width="100%"

MATERIALS_DB[material].brands.forEach(b=>{
const opt=document.createElement("option")
opt.value=b
opt.text=b
brandSelect.appendChild(opt)
})

card.appendChild(matTitle)
card.appendChild(varietySelect)
card.appendChild(brandSelect)

container.appendChild(card)

})

}
