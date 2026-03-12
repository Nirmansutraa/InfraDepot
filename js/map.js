async function loadSuppliers(){

const suppliers=await apiRequest({
action:"get_suppliers"
})

console.log(suppliers)

}
