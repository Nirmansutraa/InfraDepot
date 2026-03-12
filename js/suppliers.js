async function submitSurvey(){

const data={

firm:document.getElementById("firm_name").value,

owner_name:document.getElementById("owner_name").value,

owner_phone:document.getElementById("owner_phone").value,

owner_whatsapp:document.getElementById("owner_phone").value,

manager_name:"",
manager_phone:"",
manager_whatsapp:"",

address:document.getElementById("business_address").value,

gps:"",

materials:getSelectedMaterials(),

brands:"",
fleet:getSelectedFleet(),

photos:"",

staff:"FS"

}

const result=await apiRequest({

action:"submit_supplier",
...data

})

if(result.status==="SUCCESS"){

alert("Supplier Registered: "+result.supplierID)

}else if(result.status==="DUPLICATE"){

alert("Supplier already exists: "+result.existingID)

}

}
