/* ------------------------------
   LOAD LOGIN COMPONENT
--------------------------------*/

function renderLogin(){

fetch("components/login.html")
.then(res => res.text())
.then(html => {

document.getElementById("auth_layer").innerHTML = html
document.getElementById("app_layer").innerHTML = ""

})

}


/* ------------------------------
   LOAD DASHBOARD
--------------------------------*/

function showDashboard(){

fetch("components/dashboard.html")
.then(res => res.text())
.then(html => {

document.getElementById("auth_layer").innerHTML = ""
document.getElementById("app_layer").innerHTML = html

})

}


/* ------------------------------
   OPEN SURVEY MODULE
--------------------------------*/

function openSurvey(){

fetch("components/survey.html")
.then(res => res.text())
.then(html => {

document.getElementById("app_layer").innerHTML = html

renderMaterials()
renderFleet()

})

}


/* ------------------------------
   RENDER MATERIAL OPTIONS
--------------------------------*/

function renderMaterials(){

let html=""

materials.forEach(m=>{

html += `

<label class="checkbox-item">

<input type="checkbox" value="${m}">

${m}

</label>

`

})

document.getElementById("materials_list").innerHTML = html

}


/* ------------------------------
   RENDER FLEET OPTIONS
--------------------------------*/

function renderFleet(){

let html=""

fleetTypes.forEach(f=>{

html += `

<label class="checkbox-item">

<input type="checkbox" value="${f}">

${f}

</label>

`

})

document.getElementById("fleet_list").innerHTML = html

}


/* ------------------------------
   COLLECT SELECTED MATERIALS
--------------------------------*/

function getSelectedMaterials(){

let selected=[]

document
.querySelectorAll('#materials_list input:checked')
.forEach(el=>{

selected.push(el.value)

})

return selected.join(",")

}


/* ------------------------------
   COLLECT SELECTED FLEET
--------------------------------*/

function getSelectedFleet(){

let selected=[]

document
.querySelectorAll('#fleet_list input:checked')
.forEach(el=>{

selected.push(el.value)

})

return selected.join(",")

}


/* ------------------------------
   LOGOUT
--------------------------------*/

function logout(){

location.reload()

}function openMap(){

fetch("components/map.html")
.then(res => res.text())
.then(html => {

document.getElementById("app_layer").innerHTML = html

initSupplierMap()

})

}
