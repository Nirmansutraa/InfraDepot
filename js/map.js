let supplierMap

/* -----------------------------
   INITIALIZE MAP
------------------------------*/

function initSupplierMap(){

supplierMap = L.map("supplier_map").setView([24.5854,73.7125],12)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
maxZoom:19
}).addTo(supplierMap)

loadSupplierMarkers()

}


/* -----------------------------
   LOAD SUPPLIERS FROM API
------------------------------*/

async function loadSupplierMarkers(){

const suppliers = await apiRequest({
action:"get_suppliers"
})

suppliers.forEach(s => {

if(!s.lat || !s.lng) return

L.marker([s.lat,s.lng])
.addTo(supplierMap)
.bindPopup(

`
<b>${s.firm}</b><br>
ID: ${s.id}<br>
Owner: ${s.owner}<br>
Phone: ${s.phone}<br>
Materials: ${s.materials}
`

)

})

}
