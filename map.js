// Look into replacing setView with fitBounds
// https://leafletjs.com/reference.html#map-fitbounds
// https://stackoverflow.com/questions/22515080/leaflet-set-initial-zoom-based-on-device-resolution

// Initialize map
var map = L.map('map', {
    maxBounds: [[46.56, -189.14],  // SW corner
                [73.15, -123.93]], // NE corner
    maxBoundsViscosity: 1.0,
    minZoom: 5
}).setView([64.793,-153.040], 5)

// OSM tiles
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 8,
    attribution: '&copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC-BY-SA</a>) | Robert Hollowood & Mary Kollander'
}).addTo(map)