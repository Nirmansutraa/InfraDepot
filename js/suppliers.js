function saveSupplier(){

const data = {

firm : document.getElementById("firm_name").value,
owner : document.getElementById("owner_name").value,
phone : document.getElementById("owner_phone").value,
gps : document.getElementById("gps_val").value

}

console.log("Supplier Saved",data)

alert("Supplier Saved")

}
