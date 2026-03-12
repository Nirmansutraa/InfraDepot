function showDashboard(){

fetch("components/dashboard.html")
.then(res => res.text())
.then(html => {

document.getElementById("auth_layer").innerHTML=""
document.getElementById("app_layer").innerHTML=html

})

}
