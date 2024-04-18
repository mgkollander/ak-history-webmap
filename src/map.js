import { CLIENT_WIDTH, LARGE_SCREEN_ZOOM, SMALL_SCREEN_ZOOM, OTM_TILE_LAYER, OSM_TILE_LAYER, STB_TILE_LAYER, ST_TILE_LAYER, MAX_BOUNDS, MAX_BOUNDS_VISCOSITY, MAX_ZOOM, INITIAL_COORDINATES } from './constants.js';

// Function to calculate minimum zoom based on current screen width
export const calculateMinZoom = () => { return document.documentElement.clientWidth < CLIENT_WIDTH ? LARGE_SCREEN_ZOOM : SMALL_SCREEN_ZOOM; };

// Function to create tile layer
const createTileLayer = (url, attr) =>  {
    const layer = L.tileLayer(url, { attribution: attr });
    layer.on('tileerror', function(error) {
        console.error('Error loading tile layer:', error);
        layer.setUrl(OSM_TILE_LAYER); // Fallback to OSM tile layer
    });
    return layer;
};

// Map configuration
const mapConfig = {
	layers: [createTileLayer(OTM_TILE_LAYER, '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | © <a href="https://opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)')],
	maxBounds: MAX_BOUNDS,
	maxBoundsViscosity: MAX_BOUNDS_VISCOSITY,
	minZoom: calculateMinZoom(),
	maxZoom: MAX_ZOOM
};

// Initialize map
export const map = L.map('map', mapConfig).setView(INITIAL_COORDINATES, calculateMinZoom());

// Layer control
L.control.layers({
    'OTM Map': mapConfig.layers[0],
    'OSM Map': createTileLayer(OSM_TILE_LAYER, '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'),
    'ST': createTileLayer(ST_TILE_LAYER),
    'STB': createTileLayer(STB_TILE_LAYER),
    'Static Map': L.imageOverlay('static/imgs/akmap.png', MAX_BOUNDS)
}).addTo(map);

/* ---------- BOUNDARY CREATING CODE BELOW >> REMOVE LATER ---------- */

let regions = [];
let markers = [];

map.on('click', function(e) {
    let marker = L.marker(e.latlng).addTo(map);
    markers.push(marker);
    regions.push(e.latlng);

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            console.log(regions);
            L.polygon(regions, {color: 'blue'}).addTo(map);
            markers.forEach(marker => map.removeLayer(marker));
            regions = [];
            markers = [];
        } else if (event.ctrlKey && markers.length > 0) {
            let lastMarker = markers.pop();
            map.removeLayer(lastMarker);
            regions.pop();
        }
    });
});