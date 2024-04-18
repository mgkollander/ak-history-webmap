import { CLIENT_WIDTH, LARGE_SCREEN_ZOOM, SMALL_SCREEN_ZOOM, OTM_TILE_LAYER, OSM_TILE_LAYER, STB_TILE_LAYER, ST_TILE_LAYER, MAX_BOUNDS, MAX_BOUNDS_VISCOSITY, MAX_ZOOM, INITIAL_COORDINATES } from './constants.js';

// Function to calculate minimum zoom based on current screen width
export const calculateMinZoom = () => { return document.documentElement.clientWidth < CLIENT_WIDTH ? LARGE_SCREEN_ZOOM : SMALL_SCREEN_ZOOM; };

// Function to create tile layer
const createTileLayer = (url, attr) =>  {
    const layer = L.tileLayer(url, { attribution: attr });
    layer.on('tileerror', function(error) {
        console.error('Error loading tile layer:', error);
        layer.setUrl(OTM_TILE_LAYER, '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | © <a href="https://opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'); // Fallback to OTM tile layer
    });
    return layer;
};

// Map configuration
const mapConfig = {
	layers: [createTileLayer(ST_TILE_LAYER, `<a href="<a href="https://stamen.com/" target="_blank">Stamen Design</a> | <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> | <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> | <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`)],
	maxBounds: MAX_BOUNDS,
	maxBoundsViscosity: MAX_BOUNDS_VISCOSITY,
	minZoom: calculateMinZoom(),
	maxZoom: MAX_ZOOM
};

// Initialize map
export const map = L.map('map', mapConfig).setView(INITIAL_COORDINATES, calculateMinZoom());

// Layer control
/*
L.control.layers({
    'OTM Map': mapConfig.layers[0],
    'OSM Map': createTileLayer(OSM_TILE_LAYER, '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'),
    'ST': createTileLayer(ST_TILE_LAYER),
    'STB': createTileLayer(STB_TILE_LAYER),
    'Static Map': L.imageOverlay('static/imgs/akmap.png', MAX_BOUNDS)
}).addTo(map);
*/

// Boundary creation on mouse click (for testing purposes)
/*
let regions = [];
let polyline = null;
map.on('click', function(e) {
    regions.push(e.latlng);
    if (polyline) {
        map.removeLayer(polyline);
    }
    polyline = L.polyline(regions, {color: 'blue'}).addTo(map);
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            console.log(regions);
            L.polygon(regions, {color: 'blue'}).addTo(map);
            regions = [];
            map.removeLayer(polyline);
            polyline = null;
        } else if (event.ctrlKey && regions.length > 0) {
            regions.pop();
            map.removeLayer(polyline);
            polyline = L.polyline(regions, {color: 'blue'}).addTo(map);
        }
    });
});
*/