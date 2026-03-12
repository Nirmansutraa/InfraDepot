/* --------------------------------
   COLLECT SUPPLIER DATA
-------------------------------- */

function collectSupplierData(){

const data = {

firm: document.getElementById("firm_name").value,

owner_name: document.getElementById("owner_name").value,

owner_phone: document.getElementById("owner_phone").value,

owner_whatsapp: document.getElementById("owner_phone").value,

manager_name: "",
manager_phone: "",
manager_whatsapp: "",

address: document.getElementById("business_address").value,

gps: "",

materials: getSelectedMaterials(),

brands: "",

fleet: getSelectedFleet(),

photos: "",

staff: "FS"

}

return data

}


/* --------------------------------
   SUBMIT SUPPLIER
-------------------------------- */

async function submitSurvey(){

const supplierData = collectSupplierData()

if(!supplierData.firm){

alert("Firm name required")
return

}

if(!supplierData.owner_phone){

alert("Owner phone required")
return

}

try{

const result = await apiRequest({

action:"submit_supplier",
...supplierData

})

handleSubmissionResponse(result)

}catch(err){

console.error(err)

alert("Submission failed")

}

}


/* --------------------------------
   HANDLE SERVER RESPONSE
-------------------------------- */

function handleSubmissionResponse(result){

if(result.status === "SUCCESS"){

alert("Supplier Registered: " + result.supplierID)

showDashboard()

}

else if(result.status === "DUPLICATE"){

alert("Supplier already exists: " + result.existingID)

}

else{

alert("Unknown response")

}

}
