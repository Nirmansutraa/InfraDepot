/* -----------------------------------
InfraDepot Application Boot Module
----------------------------------- */


/* System Start */

document.addEventListener("DOMContentLoaded", startInfraDepot)


function startInfraDepot(){

console.log("InfraDepot system starting...")

initializeApp()

}


/* -----------------------------------
Initialize Application
----------------------------------- */

function initializeApp(){

loadLogin()

}


/* -----------------------------------
Load Login Component
----------------------------------- */

function loadLogin(){

fetch("components/login.html")

.then(response => response.text())

.then(html => {

document.getElementById("auth_layer").innerHTML = html

document.getElementById("app_layer").innerHTML = ""

})

.catch(err => {

console.error("Login component failed to load", err)

})

}
