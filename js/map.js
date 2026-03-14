/**
 * INFRA DEPOT - PRECISION GPS & REVERSE GEOCODING
 */
export const MapEngine = {
    init: function(containerId) {
        if (!document.getElementById(containerId)) return;
        this.map = L.map(containerId).setView([24.5854, 73.7125], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(this.map);
        this.marker = L.marker([24.5854, 73.7125]).addTo(this.map);
    },

    captureGPS: async function() {
        if (!navigator.geolocation) return alert("GPS Not Supported");

        const options = {
            enableHighAccuracy: true, // Targets < 10ft accuracy
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            
            // Update UI with coordinates
            document.getElementById('survey_coords').value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Acc: ${accuracy.toFixed(1)}m)`;
            
            // Move Map
            this.map.setView([latitude, longitude], 18);
            this.marker.setLatLng([latitude, longitude]);

            // Reverse Geocoding (Get Address)
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                if (data.display_name) {
                    document.getElementById('business_address').value = data.display_name;
                }
            } catch (e) {
                console.error("Address lookup failed");
            }

            alert(`Location Locked! Accuracy: ${accuracy.toFixed(1)} meters`);
        }, (err) => alert("GPS Error: " + err.message), options);
    }
};

window.MapEngine = MapEngine;
