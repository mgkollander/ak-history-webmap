import { CLIENT_WIDTH, LARGE_SCREEN_ZOOM, SMALL_SCREEN_ZOOM, OTM_TILE_LAYER, OSM_TILE_LAYER, STB_TILE_LAYER, ST_TILE_LAYER, MAX_BOUNDS, MAX_BOUNDS_VISCOSITY, MAX_ZOOM, INITIAL_COORDINATES } from './constants.js';
import { fetchGeoJson } from './languages.js';

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

const baseLayers = {
    'Topological': createTileLayer(OTM_TILE_LAYER),
    'Language Boundaries': createTileLayer(OSM_TILE_LAYER)
}

// Map configuration
const mapConfig = {
	layers: [baseLayers['Topological']],
	maxBounds: MAX_BOUNDS,
	maxBoundsViscosity: MAX_BOUNDS_VISCOSITY,
	minZoom: calculateMinZoom(),
	maxZoom: MAX_ZOOM
};

// Initialize map
export const map = L.map('map', mapConfig).setView(INITIAL_COORDINATES, calculateMinZoom());

// Add tile layers to map
new L.Control.Layers(baseLayers).addTo(map);

// test polygon
/* var latlangs = [
    [69.413930, -153.456444],
    [66.239419, -145.031056],
    [62.743706, -158.925556]
];
var polygon = L.polygon(latlangs, {color: 'red'});
polygon.addTo(map) */


// Fetch GeoJSON data when Language Boundaries layer selected
map.on('baselayerchange', function (event) {
    if (event.name === 'Language Boundaries') {
        fetchGeoJson();
    } else {
        map.eachLayer(function (layer) {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
    }
});
