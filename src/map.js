import { CLIENT_WIDTH, LARGE_SCREEN_ZOOM, SMALL_SCREEN_ZOOM, OSM_TILE_LAYER, TOPO_TILE_LAYER, MAX_BOUNDS, MAX_BOUNDS_VISCOSITY, MAX_ZOOM, INITIAL_COORDINATES } from './constants.js';

// Function to calculate minimum zoom based on current screen width
export const calculateMinZoom = () => { return document.documentElement.clientWidth < CLIENT_WIDTH ? LARGE_SCREEN_ZOOM : SMALL_SCREEN_ZOOM; };

// Function to create tile layer
const createTileLayer = (url) =>  {
    const layer = L.tileLayer(url);
    layer.on('tileerror', function(error) {
        console.error('Error loading tile:', error);
        layer.setUrl(OSM_TILE_LAYER); // Fallback to OSM tile layer
    });
    return layer;
};

// Map configuration
const mapConfig = {
	layers: [createTileLayer(TOPO_TILE_LAYER)],
	maxBounds: MAX_BOUNDS,
	maxBoundsViscosity: MAX_BOUNDS_VISCOSITY,
	minZoom: calculateMinZoom(),
	maxZoom: MAX_ZOOM,
	attributionControl: false
};

// Initialize map
export const map = L.map('map', mapConfig).setView(INITIAL_COORDINATES, calculateMinZoom());

// Layer control
L.control.layers({
    'OpenTopoMap': createTileLayer(TOPO_TILE_LAYER),
    'OpenStreetMap': createTileLayer(OSM_TILE_LAYER)
}).addTo(map);