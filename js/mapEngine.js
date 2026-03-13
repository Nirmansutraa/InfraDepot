let supplierMap
let supplierMarkers = []

function initSupplierMap(){

supplierMap = L.map('map').setView([24.5854,73.7125],13)

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(supplierMap)

loadSupplierPins()

}

function addSupplierPin(supplier){

if(!supplier.gps) return

let parts = supplier.gps.split(",")

let lat = parseFloat(parts[0])
let lon = parseFloat(parts[1])

const marker = L.marker([lat,lon]).addTo(supplierMap)

let popupHTML = `
<b>${supplier.firm}</b><br>
Owner: ${supplier.owner}<br>
Mobile: ${supplier.owner_mobile}<br>
Materials: ${supplier.materials}
`

marker.bindPopup(popupHTML)

supplierMarkers.push(marker)

}

function loadSupplierPins(){

let data = localStorage.getItem("infra_suppliers")

if(!data) return

let suppliers = JSON.parse(data)

suppliers.forEach(s => addSupplierPin(s))

}
