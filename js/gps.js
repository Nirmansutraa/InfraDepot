/* ---------------------------------------
InfraDepot GPS + Map Module
--------------------------------------- */

let map
let marker


/* ---------- INITIALIZE MAP ---------- */

function initMap(){

const mapContainer = document.getElementById("map")

if(!mapContainer) return

map = L.map("map").setView([24.5854,73.7125],13)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
maxZoom:19
}
).addTo(map)

}


/* ---------- CAPTURE GPS ---------- */

function getGPS(){

if(!navigator.geolocation){

alert("GPS not supported on this device")
return

}

navigator.geolocation.getCurrentPosition(

async function(position){

const lat = position.coords.latitude
const lng = position.coords.longitude

document.getElementById("gps_val").value =
lat + "," + lng

if(marker) map.removeLayer(marker)

marker = L.marker([lat,lng]).addTo(map)

map.setView([lat,lng],17)

reverseGeocode(lat,lng)

},

function(){

alert("GPS access denied")

},

{
enableHighAccuracy:true,
timeout:10000
}

)

}


/* ---------- REVERSE GEOCODING ---------- */

async function reverseGeocode(lat,lng){

try{

const url =
"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat="
+ lat +
"&lon="
+ lng

const res = await fetch(url)

const data = await res.json()

if(data.display_name){

document.getElementById("business_address").value =
data.display_name

}

}
catch(err){

console.log("Reverse geocode failed")

}

}


/* ---------- AUTO INIT WHEN PAGE LOADS ---------- */

document.addEventListener("DOMContentLoaded", function(){

initMap()

})
