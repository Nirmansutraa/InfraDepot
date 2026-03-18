// ================= DATA =================
function getData(){

return {
  owner: ownerName.value,
  phone: ownerPhone.value,
  whatsapp: ownerWhatsapp.value,
  manager: managerName.value,
  gps: coordinates.value,
  address: address.value,
  materials: selectedMaterials,
  timestamp: new Date().toISOString()
};

}

// ================= INDEXED DB =================
let db;
let req = indexedDB.open("InfraDepotDB",1);

req.onupgradeneeded = e=>{
  db = e.target.result;
  db.createObjectStore("survey",{keyPath:"id",autoIncrement:true});
};

req.onsuccess = e=>{ db=e.target.result };

// SAVE LOCAL
function saveLocal(){

let tx = db.transaction("survey","readwrite");
let store = tx.objectStore("survey");

store.add(getData());

alert("Saved Offline Successfully");

}

// ================= CLOUD =================
function syncCloud(){

let data = getData();

console.log("Uploading:",data);

// Firebase hook
alert("Next step: connect Firebase");

}
