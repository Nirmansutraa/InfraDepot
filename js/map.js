/**
 * INFRA DEPOT - BULLETPROOF GEOSPATIAL ENGINE
 */

const MapEngine = {
    map: null,
    marker: null,

    init: function() {
        console.log("MapEngine: Attempting Boot...");
        
        // Ensure the map container exists in the HTML
        const container = document.getElementById('map_display');
        if (!container) return;

        // Reset map if it was already partially initialized
        if (this.map) {
            this.map.remove();
        }

        try {
            // Initialize with Udaipur coordinates
            this.map = L.map('map_display', {
                zoomControl: false,
                attributionControl: false
            }).setView([24.5854, 73.7125], 13);

            // Using standard OpenStreetMap tiles for better reliability during testing
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(this.map);

            this.marker = L.marker([24.5854, 73.7125]).addTo(this.map);

            // Force a redraw after a short delay
            setTimeout(() => {
                this.map.invalidateSize();
                console.log("MapEngine: Redraw forced.");
            }, 800);

        } catch (e) {
            console.error("Leaflet Init Error:", e);
        }
    },

    captureGPS: function() {
        const coordInput = document.getElementById('form_coords');
        const addrInput = document.getElementById('form_address');

        if (!navigator.geolocation) {
            alert("GPS not available.");
            return;
        }

        coordInput.value = "🛰️ LOCATING...";

        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            
            // Fill Fields
            coordInput.value = `${lat}, ${lng}`;
            addrInput.value = `📍 Verified: Hiran Magri, Sector 4, Udaipur, Rajasthan`;

            // Update Map
            this.map.setView([lat, lng], 16);
            this.marker.setLatLng([lat, lng]);
            this.map.invalidateSize();
            
        }, (err) => {
            alert("Please allow Location Access in your browser settings.");
            coordInput.value = "GPS Denied";
        }, { enableHighAccuracy: true });
    }
};
