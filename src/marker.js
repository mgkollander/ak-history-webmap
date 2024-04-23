import { INITIAL_END_YEAR, MIN_START_YEAR, CLUSTER_SIZE, ICON_SIZE, ICON_ANCHOR, POPUP_ANCHOR } from './constants.js';
import { map } from './map.js';

export let markerData = [];
export let markersOnMapFeatures = [];
export let markersOnMapMarkers = [];

// Create PruneCluster instance and layer group
export const prune = new PruneClusterForLeaflet();

// Function to create new marker
export const createMarker = ({ geometry: { coordinates }, properties }) => {
    const marker = new PruneCluster.Marker(coordinates[1], coordinates[0], { properties });
    prune.RegisterMarker(marker);
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
    prune.RemoveMarkers([marker]);
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
        map.addLayer(prune);
        prune.ProcessView();
    } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        window.alert('Error: Marker data was unable to be loaded. Please try again later.');
        throw error;
    }
};

// Set cluster size
prune.Cluster.Size = CLUSTER_SIZE;

// Marker configuration
prune.PrepareLeafletMarker = (marker, data) => {
    marker.setIcon(L.icon({
        iconUrl: 'static/marker.png',
        iconSize: ICON_SIZE,
        iconAnchor: ICON_ANCHOR,
        popupAnchor: POPUP_ANCHOR,
        keepInView: true
    }));

    let {startDate, endDate, description, dataRef, imageUrl} = data.properties;
    let dateTitle = startDate == endDate ? startDate : `${startDate} - ${endDate}`;

    let popupContent =  `
        <div class="popup-content">
            <b class="date-title">${dateTitle}</b><br><br>${description}
            ${dataRef ? `<br><br><a href="${dataRef}" target="_blank">→ learn more</a>` : ''}
            ${imageUrl ? `<br><figure><img src="${imageUrl}" class="image-style"></figure></div>` : '</div><br>'}
        `;

    marker.bindPopup(popupContent);

    // Click event listener to focus on selected marker
    marker.on('click', () => {
        map.setView(marker.getLatLng(), map.getZoom(), { animate: true });
    }); 
};

// Cluster configuration
prune.BuildLeafletClusterIcon = (cluster) => {
    return L.divIcon({
        html: '<div class="cluster-icon">' + cluster.population + '</div>',
        className: 'custom-cluster-icon',
        iconSize: ICON_SIZE,
        iconAnchor: ICON_ANCHOR
    });
};

fetchGeoJson();