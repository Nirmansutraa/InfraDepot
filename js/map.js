/**
 * INFRA DEPOT - MAP & GPS ENGINE
 */
export const MapEngine = {
    init: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Map: Container #${containerId} not found yet. Skipping init.`);
            return;
        }

        console.log("Map: Initializing GPS tracking...");
        this.map = L.map(containerId).setView([24.5854, 73.7125], 13);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(this.map);
    },

    // RENAMED to match your button's onclick="MapEngine.captureGPS()"
    captureGPS: function() {
        if (!navigator.geolocation) {
            return alert("GPS not supported on this device");
        }

        console.log("GPS: Requesting coordinates...");
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            
            const latInput = document.getElementById('survey_lat');
            const lngInput = document.getElementById('survey_lng');
            
            if(latInput) latInput.value = lat;
            if(lngInput) lngInput.value = lng;

            alert(`Location Captured: ${lat}, ${lng}`);
        }, (err) => {
            alert("Please enable GPS/Location permissions in your browser settings.");
        });
    }
};

window.MapEngine = MapEngine;
