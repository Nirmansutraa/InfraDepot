/* =================================
InfraDepot API Connector
================================= */

const API_URL =
"https://script.google.com/macros/s/AKfycbwI99TO82FO-l10TcnTQSJeVu3W-K3lkO1zZDd65ePsA6zGBqo2uRUglUMEFL8qjWq-/exec";


/* SEND SUPPLIER DATA */

async function sendSupplierToServer(data){

try{

await fetch(API_URL,{

method:"POST",
mode:"no-cors",
headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify({
action:"submit_supplier",
...data
})

})

console.log("Supplier sent to server")

}catch(error){

console.log("Server connection failed")

}

}
