/* -----------------------------------------
   INFRADEPOT API CONNECTOR
------------------------------------------ */

const API_URL =
"https://script.google.com/macros/s/AKfycbyBe9D2_FMlUyGVznsSUscOC-WT2Wzbl67By1BA6APEGv23ddbarvffU2D1VG-E3lQy/exec";


/* -----------------------------------------
   GENERIC API REQUEST
------------------------------------------ */

async function apiRequest(payload){

try{

console.log("Sending request:", payload)

const response = await fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(payload)

})

const data = await response.json()

console.log("Server response:",data)

return data

}

catch(error){

console.error("API ERROR:",error)

alert("Server connection failed")

return {status:"ERROR"}

}

}
