/* ----------------------------------
   CAPTURE GPS LOCATION
---------------------------------- */

function captureGPS(){

if(!navigator.geolocation){

alert("Geolocation not supported")
return

}

navigator.geolocation.getCurrentPosition(

position => {

const lat = position.coords.latitude
const lng = position.coords.longitude

const gps = lat + "," + lng

document.getElementById("gps_val").value = gps

reverseGeocode(lat,lng)

},

error => {

alert("Unable to capture location")

},

{
enableHighAccuracy:true,
timeout:10000,
maximumAge:0
}

)

}


/* ----------------------------------
   REVERSE GEOCODING
---------------------------------- */

async function reverseGeocode(lat,lng){

try{

const url =
"https://nominatim.openstreetmap.org/reverse?format=json&lat="+lat+"&lon="+lng

const res = await fetch(url)

const data = await res.json()

if(data.display_name){

document.getElementById("business_address").value =
data.display_name

}

}catch(err){

console.log("Reverse geocode failed")

}

}
