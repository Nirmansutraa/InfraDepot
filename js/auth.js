/* LOGIN FUNCTION */

async function login(){

const id = document.getElementById("login_id").value
const password = document.getElementById("login_pass").value

const data = await apiRequest({
action:"login",
id:id,
password:password
})

if(data.status === "OK"){

showDashboard()

}else{

document.getElementById("login_status").innerText =
"Login failed"

}

}


/* LOAD DASHBOARD AFTER LOGIN */

function showDashboard(){

fetch("components/dashboard.html")
.then(res => res.text())
.then(html => {

document.getElementById("auth_layer").innerHTML = ""
document.getElementById("app_layer").innerHTML = html

})

}


/* LOGOUT */

function logout(){

location.reload()

}
