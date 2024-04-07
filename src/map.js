import { CLIENT_WIDTH, LARGE_SCREEN_ZOOM, SMALL_SCREEN_ZOOM, DEFAULT_TILE_LAYER, MAX_BOUNDS, MAX_BOUNDS_VISCOSITY, MAX_ZOOM, INITIAL_COORDINATES } from './constants.js';

// Function to calculate minimum zoom based on current screen width
export const calculateMinZoom = () => { return document.documentElement.clientWidth < CLIENT_WIDTH ? LARGE_SCREEN_ZOOM : SMALL_SCREEN_ZOOM; };

// Function to create tile layer
const createTileLayer = (url) =>  {
    const layer = L.tileLayer(url);
    layer.on('tileerror', function(error) {
        console.error('Error loading tile:', error);
        layer.setUrl(DEFAULT_TILE_LAYER); // Fallback to default tile layer (OTM)
    });
    return layer;
};

// Map configuration
const mapConfig = {
	layers: [createTileLayer(DEFAULT_TILE_LAYER)],
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
    'Topological Map': createTileLayer(DEFAULT_TILE_LAYER),
    'Stamen Terrain': createTileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png'),
    'Stamen Terrain Background': createTileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png')
}).addTo(map);
