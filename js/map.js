/**
 * INFRA DEPOT - GEOSPATIAL ENGINE 2026
 * Fix: Auto-resize and Tile Injection
 */

const MapEngine = {
    map: null,
    marker: null,

    init: function() {
        console.log("MapEngine: Spawning Map...");
        
        // Default: Udaipur Center
        const lat = 24.5854;
        const lng = 73.7125;

        // Create Map
        this.map = L.map('map_display', {
            zoomControl: false,
            attributionControl: false
        }).setView([lat, lng], 13);

        // March 2026 Trend: Ultra-Dark Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(this.map);

        this.marker = L.marker([lat, lng]).addTo(this.map);

        // CRITICAL FIX: Forces the map to fill the container correctly
        setTimeout(() => {
            this.map.invalidateSize();
        }, 400);
    },

    captureGPS: function() {
        const coordInput = document.getElementById('form_coords');
        const addrInput = document.getElementById('form_address');

        if (!navigator.geolocation) {
            alert("GPS blocked by device.");
            return;
        }

        coordInput.value = "📡 SATELLITE LINKING...";

        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            
            coordInput.value = `${lat}, ${lng}`;
            this.map.setView([lat, lng], 16);
            this.marker.setLatLng([lat, lng]);
            
            // Simulation of address lookup
            addrInput.value = "Verified Locality: Udaipur Hub";
        }, (err) => {
            coordInput.value = "GPS Error: " + err.message;
        }, { enableHighAccuracy: true });
    }
};
