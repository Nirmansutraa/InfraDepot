async function serverLogin(){

const id=document.getElementById("login_id").value
const password=document.getElementById("login_pass").value

const data=await apiRequest({
action:"login",
id:id,
password:password
})

if(data.status==="OK"){
alert("Login success")
}else{
alert("Login failed")
}

}
