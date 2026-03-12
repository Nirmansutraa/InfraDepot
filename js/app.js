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
