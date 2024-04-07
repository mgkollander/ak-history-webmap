import { INITIAL_END_YEAR, MIN_START_YEAR, CLUSTER_SIZE, ICON_SIZE, ICON_ANCHOR, POPUP_ANCHOR } from './constants.js';
import { map } from './map.js';

export let markerData = [];
export let markersOnMapFeatures = [];
export let markersOnMapMarkers = [];

// Create PruneCluster instance and layer group
export const pruneCluster = new PruneClusterForLeaflet();

// Function to create new marker
export const createMarker = (feature) => {
    const marker = new PruneCluster.Marker(feature.geometry.coordinates[1], feature.geometry.coordinates[0], { properties: feature.properties });
    pruneCluster.RegisterMarker(marker);
    return marker;
};

// Function to add marker to the map
export const addMarkerToMap = (feature, marker) => {
    markersOnMapFeatures.push(feature);
    markersOnMapMarkers.push(marker);
};

// Function to remove marker from the map
export const removeMarkerFromMap = (feature, marker) => {
    markersOnMapFeatures = markersOnMapFeatures.filter(item => item !== feature);
    markersOnMapMarkers = markersOnMapMarkers.filter(item => item !== marker);
    pruneCluster.RemoveMarkers([marker]);
};

// Function to add markers in initial slider range to map
const addInitialMarkers = (markerData) => {
    markerData.features.forEach(feature => {
        if (feature.properties.startDate <= INITIAL_END_YEAR && feature.properties.endDate >= MIN_START_YEAR) {
            const marker = createMarker(feature);
            addMarkerToMap(feature, marker);
        }
    });
};

// Function to fetch GeoJSON and store marker data
const fetchGeoJson = async () => {
    try {
        const response = await fetch('data/markerData.geojson');
        const data = await response.json();
        if (!data) {
            console.error('No data fetched from GeoJSON file.');
            window.alert('Error: No marker data was found. Please try again later.');
            return;
        }
        markerData = data;
        addInitialMarkers(markerData);
        map.addLayer(pruneCluster);
        pruneCluster.ProcessView();
    } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        window.alert('Error: Marker data was unable to be loaded. Please try again later.');
    }
};

// Set cluster size
PruneCluster.Cluster.Size = CLUSTER_SIZE;

// Marker configuration
pruneCluster.PrepareLeafletMarker = (marker, data) => {
    marker.setIcon(L.icon({
        iconUrl: 'static/marker.png',
        iconSize: ICON_SIZE,
        iconAnchor: ICON_ANCHOR,
        popupAnchor: POPUP_ANCHOR
    }));
    marker.bindPopup(`<b>${data.properties.startDate} - ${data.properties.endDate}</b><br>${data.properties.description}`);
};

// Cluster configuration
pruneCluster.BuildLeafletClusterIcon = (cluster) => {
    return L.divIcon({
        html: '<div class="cluster-icon">' + cluster.population + '</div>',
        className: 'custom-cluster-icon',
        iconSize: ICON_SIZE,
        iconAnchor: ICON_ANCHOR
    });
};

fetchGeoJson();