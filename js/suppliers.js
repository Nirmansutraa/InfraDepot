/* =================================
SUPPLIER SAVE MODULE
================================= */

function saveSupplier(){

const supplierData = {

firm:document.getElementById("firm_name").value,
owner_name:document.getElementById("owner_name").value,
owner_phone:document.getElementById("owner_phone").value,
gps:document.getElementById("gps_val").value,
staff:localStorage.getItem("staff_id") || "UNKNOWN"

}

console.log("Supplier:",supplierData)

/* SEND TO APPS SCRIPT */

sendSupplierToServer(supplierData)

alert("Supplier Submitted")

}
