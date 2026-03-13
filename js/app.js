document.addEventListener("DOMContentLoaded", startInfraDepot)

function startInfraDepot(){

console.log("InfraDepot system starting...")

loadLogin()

}

/* Load login interface */

function loadLogin(){

fetch("components/login.html")
.then(res => res.text())
.then(html => {

document.getElementById("auth_layer").innerHTML = html

})

}


/* Load Survey Page */

function loadSurvey(){

fetch("components/survey.html")
.then(res => res.text())
.then(html => {

document.getElementById("app_layer").innerHTML = html

initSurvey()

})

}


function initSurvey(){

console.log("Survey initialized")

if(typeof loadMaterialSelector === "function"){
loadMaterialSelector()
}

if(typeof initSupplierMap === "function"){
initSupplierMap()
}

}
