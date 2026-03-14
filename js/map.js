/**
 * INFRA DEPOT - MAP & GPS ENGINE
 */
export const MapEngine = {
    init: function(containerId) {
        console.log("Map: Initializing GPS tracking...");
        this.map = L.map(containerId).setView([24.5854, 73.7125], 13); // Udaipur center
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(this.map);

        this.marker = null;
    },

    autoFillGPS: function() {
        if (!navigator.geolocation) {
            return alert("GPS not supported on this device");
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            
            // Fill the inputs in the UI
            const latInput = document.getElementById('survey_lat');
            const lngInput = document.getElementById('survey_lng');
            
            if(latInput) latInput.value = lat;
            if(lngInput) lngInput.value = lng;

            console.log(`GPS: Located at ${lat}, ${lng}`);
        }, (err) => {
            alert("Please enable GPS/Location permissions");
        });
    }
};

// CRITICAL: Make it globally accessible
window.MapEngine = MapEngine;
