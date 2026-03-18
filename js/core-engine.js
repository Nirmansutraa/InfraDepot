// ================= MAP =================
let map = L.map('map').setView([24.5854,73.7125],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker;

// GPS + Address Auto Fill
async function captureGPS(){
navigator.geolocation.getCurrentPosition(async pos=>{

let lat=pos.coords.latitude;
let lng=pos.coords.longitude;

document.getElementById("coordinates").value = lat+","+lng;

if(marker) map.removeLayer(marker);
marker = L.marker([lat,lng]).addTo(map);
map.setView([lat,lng],15);

// Reverse Geocode
let res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
let data = await res.json();

document.getElementById("address").value = data.display_name;

});
}

// ================= AUTO WHATSAPP =================
["owner","manager"].forEach(type=>{
document.getElementById(type+"Phone").addEventListener("input",()=>{
let wp=document.getElementById(type+"Whatsapp");
if(!wp.dataset.modified){
wp.value=document.getElementById(type+"Phone").value;
}
});

document.getElementById(type+"Whatsapp").addEventListener("input",function(){
this.dataset.modified=true;
});
});

// ================= PHOTO =================
let photos = [];

function handlePhoto(e){
if(photos.length>=10){
alert("Max 10 photos");
return;
}

let file = e.target.files[0];

compressImage(file,512).then(blob=>{
let reader = new FileReader();

reader.onload = function(){
photos.push({
img:reader.result,
time:new Date().toISOString(),
gps:document.getElementById("coordinates").value
});

renderPhotos();
};

reader.readAsDataURL(blob);
});
}

function renderPhotos(){
let div=document.getElementById("photos");
div.innerHTML="";
photos.forEach(p=>{
let img=document.createElement("img");
img.src=p.img;
img.style.width="70px";
div.appendChild(img);
});
}

function compressImage(file,maxKB){
return new Promise(resolve=>{
let img=new Image();
let reader=new FileReader();

reader.onload=e=>img.src=e.target.result;
reader.readAsDataURL(file);

img.onload=()=>{
let canvas=document.createElement("canvas");
let ctx=canvas.getContext("2d");

canvas.width=img.width*0.6;
canvas.height=img.height*0.6;

ctx.drawImage(img,0,0);

canvas.toBlob(blob=>{
resolve(blob);
},"image/jpeg",0.7);
};
});
}

// ================= FLEET =================
const fleet=["Tractor","Mini Truck","Truck","Mini Dumper","Dumper","Trailer"];
let fleetDiv=document.getElementById("fleetContainer");

fleet.forEach(f=>{
let id=f.replace(" ","");
fleetDiv.innerHTML+=`
<div class="counter">${f}
<div>
<button onclick="update('${id}',-1)">-</button>
<span id="${id}">0</span>
<button onclick="update('${id}',1)">+</button>
</div>
</div>
`;
});

function update(id,val){
let el=document.getElementById(id);
let v=parseInt(el.innerText);
v+=val;
if(v<0)v=0;
el.innerText=v;
}

// ================= INDEXED DB =================
let db;
let req=indexedDB.open("InfraDepotDB",1);

req.onupgradeneeded=e=>{
db=e.target.result;
db.createObjectStore("survey",{keyPath:"id",autoIncrement:true});
};

req.onsuccess=e=>{db=e.target.result};

function saveLocal(){
let tx=db.transaction("survey","readwrite");
let store=tx.objectStore("survey");

store.add(getData());
alert("Saved Offline");
}

// ================= CLOUD =================
function syncCloud(){
let data=getData();
console.log("Sync:",data);

// Firebase hook here
alert("Ready for Firebase sync");
}

// ================= DATA =================
function getData(){
return{
owner:ownerName.value,
phone:ownerPhone.value,
whatsapp:ownerWhatsapp.value,
manager:managerName.value,
gps:coordinates.value,
address:address.value,
photos:photos
};
}
