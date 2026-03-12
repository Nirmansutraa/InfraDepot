async function submitSupplier(data){

const result=await apiRequest({

action:"submit_supplier",
...data

})

return result

}
