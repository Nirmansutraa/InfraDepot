
/* ---------------------------------------
InfraDepot Survey Logic
--------------------------------------- */

/* ---------- GLOBAL VARIABLES ---------- */

let activePhotos = []

/* ---------- SUPPLIER ID GENERATION ---------- */

function updateID(){

const firm = document.getElementById("firm_name").value

if(!firm){
document.getElementById("sup_id").innerText = "ID---"
return
}

const rand = Math.floor(1000 + Math.random()*9000)

document.getElementById("sup_id").innerText = "ID-SUP-" + rand

}


/* ---------- PHOTO CAPTURE ---------- */

function handlePhotos(input){

const files = Array.from(input.files)

files.forEach(file=>{

const reader = new FileReader()

reader.onload = function(e){

activePhotos.push(e.target.result)

renderPhotoPreview()

}

reader.readAsDataURL(file)

})

}


/* ---------- PHOTO PREVIEW ---------- */

function renderPhotoPreview(){

const zone = document.getElementById("preview_zone")

zone.innerHTML = ""

activePhotos.forEach(src=>{

const img = document.createElement("img")

img.src = src
img.className = "thumb"

zone.appendChild(img)

})

}


/* ---------- COLLECT SURVEY DATA ---------- */

function getEntryData(){

return {

ID: document.getElementById("sup_id").innerText,

Firm: document.getElementById("firm_name").value,

Owner: document.getElementById("owner_name").value,

Phone: document.getElementById("owner_phone").value,

Address: document.getElementById("business_address").value,

GPS: document.getElementById("gps_val").value,

Photos: activePhotos,

Timestamp: new Date().toISOString()

}

}


/* ---------- LOCAL SAVE ---------- */

function saveLocal(){

const data = getEntryData()

if(!data.Firm){
alert("Firm name required")
return
}

let db = JSON.parse(localStorage.getItem("infra_local_db") || "[]")

db.unshift(data)

localStorage.setItem("infra_local_db", JSON.stringify(db))

alert("Saved locally")

refreshHistory()

}


/* ---------- HISTORY RENDER ---------- */

function refreshHistory(){

const db = JSON.parse(localStorage.getItem("infra_local_db") || "[]")

const list = document.getElementById("history_list")

if(!list) return

list.innerHTML = db.slice(0,5).map(item=>`

<div class="history-card">

<b>${item.Firm}</b>
<span style="float:right;color:orange">${item.ID}</span>
<br>

<small>${new Date(item.Timestamp).toLocaleString()}</small>

</div>

`).join("")

}


/* ---------- CLOUD SUBMIT ---------- */

async function submitData(){

const data = getEntryData()

if(!data.Firm){
alert("Firm name required")
return
}

saveLocal()

try{

const result = await apiRequest({
action:"submit_supplier",
...data
})

alert("Submitted successfully")

}catch(err){

alert("Network error, stored locally")

}

}


/* ---------- INIT SURVEY ---------- */

function initSurvey(){

updateID()

refreshHistory()

}
