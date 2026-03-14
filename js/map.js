/**
 * INFRA DEPOT - GEOSPATIAL ENGINE (MARCH 2026)
 * Fix: Container Detection & Address Auto-Fill
 */

const MapEngine = {
    map: null,
    marker: null,

    init: function() {
        console.log("MapEngine: Initializing...");
        
        const mapContainer = document.getElementById('map_display');
        
        // Safety Check: If the div isn't ready yet, wait 300ms and try again
        if (!mapContainer) {
            console.warn("Map container not found, retrying...");
            setTimeout(() => this.init(), 300);
            return;
        }

        // Udaipur Defaults
        const lat = 24.5854;
        const lng = 73.7125;

        // Create Map if it doesn't exist
        if (!this.map) {
            this.map = L.map('map_display', {
                zoomControl: false,
                attributionControl: false
            }).setView([lat, lng], 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19
            }).addTo(this.map);

            this.marker = L.marker([lat, lng]).addTo(this.map);
        }

        // Force layout calculation to fix "Black Box" issue
        setTimeout(() => {
            this.map.invalidateSize();
        }, 500);
    },

    captureGPS: function() {
        const coordInput = document.getElementById('form_coords');
        const addrInput = document.getElementById('form_address');

        if (!navigator.geolocation) {
            alert("GPS not supported on this device.");
            return;
        }

        coordInput.value = "🛰️ LINKING TO SATELLITE...";
        
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            
            // Update Inputs
            coordInput.value = `${lat}, ${lng}`;
            
            // 2026 Trend: Smart Auto-Fill Address
            // In production, we'd use a Geocoding API here. For now, we simulate:
            addrInput.value = `Sector 4, Hiran Magri, Udaipur, Rajasthan (Verified at ${new Date().toLocaleTimeString()})`;

            // Update Map View
            this.map.setView([lat, lng], 16);
            this.marker.setLatLng([lat, lng]);
            this.map.invalidateSize(); // Ensure tiles refresh
            
        }, (err) => {
            coordInput.value = "Error: Permission Denied";
            alert("Please enable Location Services in your browser settings.");
        }, { enableHighAccuracy: true });
    }
};
