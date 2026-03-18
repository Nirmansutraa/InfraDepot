// ================= IMPORTS =================
import { db, storage, collection, addDoc, ref, uploadString, getDownloadURL } from "./firebase-config.js";

// ================= GLOBAL STATE =================
let photos = [];
let trackingId = "";

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {

  // Generate Tracking ID
  trackingId = "ID-" + Date.now();
  document.getElementById("trackingIdBox").innerText = trackingId;

  // WhatsApp Auto Sync
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

  initMap();
  initFleet();

});

// ================= MAP =================
let map, marker;

function initMap(){
  map = L.map('map').setView([24.5854,73.7125],13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

window.captureGPS = async function(){

  navigator.geolocation.getCurrentPosition(async pos=>{

    let lat = pos.coords.latitude;
    let lng = pos.coords.longitude;

    document.getElementById("coordinates").value = lat + "," + lng;

    if(marker) map.removeLayer(marker);
    marker = L.marker([lat,lng]).addTo(map);
    map.setView([lat,lng],15);

    // Reverse Geocode
    let res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    let data = await res.json();

    document.getElementById("address").value = data.display_name;

  });

};

// ================= PHOTO =================
window.handlePhoto = function(e){

  if(photos.length >= 10){
    alert("Max 10 photos allowed");
    return;
  }

  let file = e.target.files[0];
  if(!file) return;

  compressImage(file).then(base64 => {

    photos.push({
      img: base64,
      time: new Date().toISOString(),
      gps: document.getElementById("coordinates").value
    });

    renderPhotos();

  });

};

function renderPhotos(){
  let div = document.getElementById("photos");
  div.innerHTML = "";

  photos.forEach(p=>{
    let img = document.createElement("img");
    img.src = p.img;
    div.appendChild(img);
  });
}

function compressImage(file){
  return new Promise(resolve=>{
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = e=>{
      let img = new Image();
      img.src = e.target.result;

      img.onload = ()=>{
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width * 0.6;
        canvas.height = img.height * 0.6;

        ctx.drawImage(img,0,0,canvas.width,canvas.height);

        resolve(canvas.toDataURL("image/jpeg",0.7));
      };
    };
  });
}

// ================= FLEET =================
function initFleet(){

  const fleet = ["Tractor","Mini Truck","Truck","Mini Dumper","Dumper","Trailer"];
  let fleetDiv = document.getElementById("fleetContainer");

  fleet.forEach(f=>{
    let id = f.replace(" ","");

    fleetDiv.innerHTML += `
      <div class="counter">${f}
        <div>
          <button onclick="updateFleet('${id}',-1)">-</button>
          <span id="${id}">0</span>
          <button onclick="updateFleet('${id}',1)">+</button>
        </div>
      </div>
    `;
  });

}

window.updateFleet = function(id,val){
  let el = document.getElementById(id);
  let v = parseInt(el.innerText);

  v += val;
  if(v < 0) v = 0;

  el.innerText = v;
};

// ================= DATA =================
function getData(){

  return {
    trackingId: trackingId,
    owner: ownerName.value,
    phone: ownerPhone.value,
    whatsapp: ownerWhatsapp.value,
    manager: managerName.value,
    managerPhone: managerPhone.value,
    managerWhatsapp: managerWhatsapp.value,
    gps: coordinates.value,
    address: address.value,
    materials: window.selectedMaterials || {},
    fleet: getFleetData(),
    timestamp: new Date().toISOString()
  };

}

function getFleetData(){
  const ids = ["Tractor","MiniTruck","Truck","MiniDumper","Dumper","Trailer"];

  let data = {};

  ids.forEach(id=>{
    let el = document.getElementById(id);
    if(el){
      data[id] = parseInt(el.innerText);
    }
  });

  return data;
}

// ================= FIREBASE UPLOAD =================
async function uploadPhotos(){

  let uploaded = [];

  for(let i=0;i<photos.length;i++){

    let storageRef = ref(storage, `surveys/${trackingId}/photo_${i}.jpg`);

    await uploadString(storageRef, photos[i].img, 'data_url');

    let url = await getDownloadURL(storageRef);

    uploaded.push({
      url: url,
      time: photos[i].time,
      gps: photos[i].gps
    });

  }

  return uploaded;
}

// ================= SYNC =================
window.syncCloud = async function(){

  try{

    let data = getData();

    let uploadedPhotos = await uploadPhotos();
    data.photos = uploadedPhotos;

    await addDoc(collection(db,"surveys"), data);

    alert("✅ Synced to Cloud");

  }catch(err){
    console.error(err);
    alert("❌ Sync Failed");
  }

};

// ================= INDEXED DB =================
let dbLocal;

let req = indexedDB.open("InfraDepotDB",1);

req.onupgradeneeded = e=>{
  dbLocal = e.target.result;
  dbLocal.createObjectStore("survey",{keyPath:"id",autoIncrement:true});
};

req.onsuccess = e=>{
  dbLocal = e.target.result;
};

// SAVE LOCAL
window.saveLocal = function(){

  let tx = dbLocal.transaction("survey","readwrite");
  let store = tx.objectStore("survey");

  store.add(getData());

  alert("Saved Offline");

};

// ================= AUTO SYNC =================
setInterval(async ()=>{

  if(navigator.onLine && dbLocal){

    let tx = dbLocal.transaction("survey","readonly");
    let store = tx.objectStore("survey");

    let all = store.getAll();

    all.onsuccess = async function(){

      for(let item of all.result){

        try{

          await addDoc(collection(db,"surveys"), item);

          let delTx = dbLocal.transaction("survey","readwrite");
          delTx.objectStore("survey").delete(item.id);

        }catch(e){
          console.log("Retry later");
        }

      }

    };

  }

},10000);