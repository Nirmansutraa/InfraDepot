const MATERIALS = {

Sand: {
  varieties: [
    { name:"River Sand", unit:"ton", price:{min:1200,max:2500}, availability:"medium", supplier:["Trader","Local"] },
    { name:"M-Sand", unit:"ton", price:{min:900,max:1800}, availability:"high", supplier:["Manufacturer","Dealer"] },
    { name:"Plaster Sand", unit:"ton", price:{min:1000,max:2000}, availability:"medium", supplier:["Trader"] },
    { name:"Concrete Sand", unit:"ton", price:{min:1100,max:2100}, availability:"medium", supplier:["Trader"] },
    { name:"Fill Sand", unit:"ton", price:{min:500,max:1200}, availability:"high", supplier:["Local"] }
  ],
  brands:["Robo Sand","Thriveni","Poabs","UltraTech","Local Supplier"]
},

Aggregates: {
  varieties: [
    { name:"10mm", unit:"ton", price:{min:900,max:1500}, availability:"high", supplier:["Crusher"] },
    { name:"20mm", unit:"ton", price:{min:800,max:1400}, availability:"high", supplier:["Crusher"] },
    { name:"40mm", unit:"ton", price:{min:700,max:1300}, availability:"medium", supplier:["Crusher"] },
    { name:"Crusher Dust", unit:"ton", price:{min:400,max:900}, availability:"high", supplier:["Crusher"] },
    { name:"GSB", unit:"ton", price:{min:600,max:1100}, availability:"medium", supplier:["Infra Supplier"] }
  ],
  brands:["UltraTech","L&T","Tata","Local Quarry"]
},

"Masonry Stone": {
  varieties: [
    { name:"Granite", unit:"sqft", price:{min:80,max:250}, availability:"medium", supplier:["Quarry"] },
    { name:"Sandstone", unit:"sqft", price:{min:60,max:180}, availability:"high", supplier:["Quarry"] },
    { name:"Limestone", unit:"sqft", price:{min:50,max:150}, availability:"high", supplier:["Quarry"] },
    { name:"Basalt", unit:"ton", price:{min:700,max:1400}, availability:"medium", supplier:["Crusher"] },
    { name:"Slate", unit:"sqft", price:{min:90,max:220}, availability:"low", supplier:["Dealer"] }
  ],
  brands:["Stonex","RK Marble","Local Quarry"]
},

"TMT Steel": {
  varieties: [
    { name:"Fe500", unit:"kg", price:{min:55,max:75}, availability:"high", supplier:["Dealer"] },
    { name:"Fe500D", unit:"kg", price:{min:60,max:80}, availability:"high", supplier:["Dealer"] },
    { name:"Fe550", unit:"kg", price:{min:65,max:85}, availability:"medium", supplier:["Dealer"] },
    { name:"Fe550D", unit:"kg", price:{min:70,max:90}, availability:"medium", supplier:["Dealer"] },
    { name:"Fe600", unit:"kg", price:{min:75,max:100}, availability:"low", supplier:["Dealer"] }
  ],
  brands:["Tata Tiscon","JSW","SAIL","Jindal","Kamdhenu"]
},

Cement: {
  varieties: [
    { name:"OPC 53", unit:"bag", price:{min:350,max:450}, availability:"high", supplier:["Dealer"] },
    { name:"OPC 43", unit:"bag", price:{min:330,max:420}, availability:"medium", supplier:["Dealer"] },
    { name:"PPC", unit:"bag", price:{min:300,max:400}, availability:"high", supplier:["Dealer"] },
    { name:"PSC", unit:"bag", price:{min:320,max:410}, availability:"medium", supplier:["Dealer"] },
    { name:"White Cement", unit:"bag", price:{min:900,max:1500}, availability:"low", supplier:["Dealer"] }
  ],
  brands:["UltraTech","ACC","Ambuja","Shree","Dalmia"]
},

Bricks: {
  varieties: [
    { name:"Red Brick", unit:"piece", price:{min:5,max:9}, availability:"high", supplier:["Kiln"] },
    { name:"Fly Ash Brick", unit:"piece", price:{min:4,max:8}, availability:"high", supplier:["Factory"] },
    { name:"AAC Block", unit:"piece", price:{min:60,max:120}, availability:"medium", supplier:["Factory"] },
    { name:"Concrete Block", unit:"piece", price:{min:40,max:100}, availability:"medium", supplier:["Factory"] },
    { name:"Hollow Block", unit:"piece", price:{min:35,max:90}, availability:"medium", supplier:["Factory"] }
  ],
  brands:["Magicrete","Siporex","UltraTech","Local Kiln"]
}

};
