import { CLIENT_WIDTH, LARGE_SCREEN_ZOOM, SMALL_SCREEN_ZOOM, OTM_TILE_LAYER, OSM_TILE_LAYER, STB_TILE_LAYER, ST_TILE_LAYER, MAX_BOUNDS, MAX_BOUNDS_VISCOSITY, MAX_ZOOM, INITIAL_COORDINATES } from './constants.js';

// Function to calculate minimum zoom based on current screen width
export const calculateMinZoom = () => { return document.documentElement.clientWidth < CLIENT_WIDTH ? LARGE_SCREEN_ZOOM : SMALL_SCREEN_ZOOM; };

// Function to create tile layer
const createTileLayer = (tileLayer) =>  {
    const layer = L.tileLayer(tileLayer[0], { attribution: tileLayer[1] });
    layer.on('tileerror', function(error) {
        console.error('Error loading tile layer:', error);
        layer.setUrl(OSM_TILE_LAYER); // Fallback to OSM tile layer
    });
    return layer;
};

// Map configuration
const mapConfig = {
	layers: [createTileLayer(OTM_TILE_LAYER)],
	maxBounds: MAX_BOUNDS,
	maxBoundsViscosity: MAX_BOUNDS_VISCOSITY,
	minZoom: calculateMinZoom(),
	maxZoom: MAX_ZOOM
};

// Initialize map
export const map = L.map('map', mapConfig).setView(INITIAL_COORDINATES, calculateMinZoom());

// Layer control
L.control.layers({
    'Topological': mapConfig.layers[0],
    'Plain': createTileLayer(OSM_TILE_LAYER),
    //'Stamen Terrain': createTileLayer(ST_TILE_LAYER),
    //'Stamen Terrain Background': createTileLayer(STB_TILE_LAYER)
}).addTo(map);