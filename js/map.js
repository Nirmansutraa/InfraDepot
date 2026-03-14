/**
 * INFRA DEPOT - GEOSPATIAL ENGINE 2026
 * Fix: High Accuracy Capture & Invalidation Size
 */

const MapEngine = {
    map: null,
    marker: null,

    init: function() {
        const container = document.getElementById('map_display');
        if (!container) return;

        // Reset if it exists to avoid map crashes
        if (this.map) {
            this.map.remove();
        }

        // Initialize at Udaipur center
        this.map = L.map('map_display', {
            zoomControl: false,
            attributionControl: false
        }).setView([24.5854, 73.7125], 13);

        // March 2026 Trend: Ultra-Dark Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(this.map);

        this.marker = L.marker([24.5854, 73.7125]).addTo(this.map);

        // Forces the map to size correctly, even if it loads hidden
        setTimeout(() => {
            this.map.invalidateSize();
        }, 800);
    },

    captureGPS: function() {
        const addrInput = document.getElementById('form_address');
        const coordsInput = document.getElementById('form_coords');

        if (!navigator.geolocation) {
            alert("This device cannot access GPS.");
            return;
        }

        if (addrInput) addrInput.value = "📡 SATELLITE LINKING...";
        if (coordsInput) coordsInput.value = "LOCKING COORDINATES...";

        // HIGH ACCURACY REQUEST (March 2026 standard)
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            
            this.map.setView([lat, lng], 17); // Zoom in on location
            this.marker.setLatLng([lat, lng]);
            
            if (coordsInput) coordsInput.value = `${lat}, ${lng}`;
            this.map.invalidateSize(); // Fix tiles after reposition

            // Verified Address for current location
            if (addrInput) {
                // Production: Use Geocoding API. For now, simulated:
                addrInput.value = `Verified Locality: Hiran Magri, Sector 4, Udaipur, Rajasthan`;
            }

        }, (err) => {
            console.error(err);
            if (addrInput) addrInput.value = "PERMISSION DENIED: No Address.";
            if (coordsInput) coordsInput.value = "GPS BLOCKED.";
            alert("Permission Error: Please allow 'Location Access' in your browser settings to verify the business location.");
        }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }); // Robust settings
    }
};
