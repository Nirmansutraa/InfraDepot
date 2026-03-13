function loginUser(){

const id = document.getElementById("staff_id").value
const pass = document.getElementById("password").value

if(id === "" || pass === ""){
alert("Enter login credentials")
return
}

/* TEMP LOGIN */

if(pass === "1234"){

loadSurvey()

}else{

alert("Invalid Login")

}

}

function loadSurvey(){

fetch("components/survey.html")
.then(res => res.text())
.then(html => {

document.getElementById("auth_layer").innerHTML = ""
document.getElementById("app_layer").innerHTML = html

})

}
