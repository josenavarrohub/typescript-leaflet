// Leaflet
import L from "leaflet";

// Styles
import "./styles.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

// Map
const map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png").addTo(map);

// Elements
const form = document.getElementById("form") as HTMLFormElement;
const placeInput = document.getElementById("place") as HTMLInputElement;

// Geocode address
async function geocodeAddress(place: string) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`)
        if (!response.ok) throw new Error(`${response.status}: Problem getting data`);
        const data = await response.json();

        if (data.length > 0) {
            const result = data[0];
            const lat = Number(result.lat);
            const lon = Number(result.lon);

            // Center map
            map.setView([lat, lon], 13);

            // Clear existing markers
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            // Add a marker at the found coordinates
            L.marker([lat, lon])
                .addTo(map)
                .bindPopup(`Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}`)
                .openPopup();
        } else {
            alert("Place not found.");
        }
    } catch (error: any) {
        console.error(error.message);
    }
}

// Handle submit
const handleSubmit = (e: SubmitEvent) => {
  e.preventDefault();
  geocodeAddress(placeInput.value);
};
form.addEventListener("submit", handleSubmit);
