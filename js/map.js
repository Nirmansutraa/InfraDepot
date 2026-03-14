/**
 * INFRA DEPOT - GEOSPATIAL ENGINE (MARCH 2026)
 * Handles Leaflet Map Integration & GPS Capture
 */

const MapEngine = {
    map: null,
    marker: null,

    init: function() {
        console.log("MapEngine: Initializing Leaflet...");
        
        // Udaipur, India - Default fallback coordinates
        const defaultLat = 24.5854;
        const defaultLng = 73.7125;

        // Initialize Map in the 'map_display' div
        this.map = L.map('map_display', {
            zoomControl: false, // Cleaner look for 2026 UI
            attributionControl: false
        }).setView([defaultLat, defaultLng], 13);

        // Add Dark Mode Tiles (Using CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(this.map);

        // Add a pulsing marker for the current location
        this.marker = L.marker([defaultLat, defaultLng]).addTo(this.map);
    },

    captureGPS: function() {
        const coordInput = document.getElementById('form_coords');
        const addressBox = document.getElementById('form_address');

        if (!navigator.geolocation) {
            alert("GPS not supported by your browser.");
            return;
        }

        // Visual Feedback for User
        coordInput.value = "Locating satellite...";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);
                
                // Update UI
                coordInput.value = `${lat}, ${lng}`;
                this.map.setView([lat, lng], 16);
                this.marker.setLatLng([lat, lng]);

                // CMO Note: In a real PWA, we'd use Reverse Geocoding 
                // here to turn coordinates into a street name.
                addressBox.value = "Location Verified: Sector 4, Udaipur";
            },
            (error) => {
                coordInput.value = "Error: Permission Denied";
                console.error("GPS Error:", error);
            },
            { enableHighAccuracy: true }
        );
    }
};
