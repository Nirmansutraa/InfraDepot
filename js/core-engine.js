
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

    let lat = pos