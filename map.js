
// Function to calculate minimum zoom based on current screen width
const calculateMinZoom = () => document.documentElement.clientWidth < 768 ? 4 : 5;

// Initialize map
const map = L.map('map', {
    maxBounds:[[46.56, -189.14],[73.15, -123.93]],
    maxBoundsViscosity: 0.5,
    minZoom: calculateMinZoom(),
    maxZoom: 8,
    attributionControl: false // Will attribute on "About" page
}).setView([64.793, -153.040], calculateMinZoom());

// Add tile layer
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png').addTo(map);

// Initialize PruneCluster
const leafletView = new PruneClusterForLeaflet();
leafletView.Cluster.Size = 50;

// Customize marker behavior
leafletView.PrepareLeafletMarker = function(leafletMarker, data) {
    let popupContent = "<b>" + data.properties.startDate + ' - ' + data.properties.endDate + "</b><br>" + data.properties.description;
    const customIcon = L.icon({
        iconUrl: 'data/icons/pin.png',
        iconSize: [40, 40],
        iconAnchor: [3, 30],
        popupAnchor: [17, -28]
    });
    // Set custom icon and popups
    leafletMarker.setIcon(customIcon);
    leafletMarker.bindPopup(popupContent);
};

// Set custom cluster icon
leafletView.BuildLeafletClusterIcon = function(cluster) {
    let population = cluster.population;
    let icon = L.divIcon({
        html: '<div class="cluster-icon">' + population + '</div>',
        className: 'custom-cluster-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });
    return icon;
};

// Create layer group
let pruneClusterLayer = L.layerGroup();

// Array to store marker data
let markerData = [];
let markersOnMapFeatures = [];
let markersOnMapMarkers = [];

// Fetch GeoJSON and store marker data
fetch('markerData.geojson')
    .then(response => response.json())
    .then(data => {
        // Store in array
        markerData = data.features;

        // Add markers in initial slider range
        markerData.forEach(feature => {
            if (feature.properties.startDate <= 1800 && feature.properties.endDate >= 1750) {
                const marker = new PruneCluster.Marker(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                marker.data.properties = feature.properties;
                leafletView.RegisterMarker(marker);

                markersOnMapFeatures.push(feature);
                markersOnMapMarkers.push(marker);
            }
        })

        // Add layer group to map
        map.addLayer(leafletView);
        leafletView.ProcessView();
    });

// Function to initialize range slider
function initializeSlider() {
    const slider = document.getElementById('slider');
    noUiSlider.create(slider, {
        start: [1750, 1800],
        connect: true,
        tooltips: [true, true],
        step: 1,
        format: { to: value => Math.round(value), from: value => value },
        range: { 'min': 1750, 'max': 2020 }
    });

    // Merge slider tooltips when overlapping
    mergeTooltips(slider, Math.floor(8600 / window.innerWidth), ' - ');

    return slider;
}

// Initialize slider
const slider = initializeSlider();

// Function to filter markers by slider range
const filterMarkersByRange = (sliderStartYear, sliderEndYear) => {
    markerData.forEach(feature => {
        // If in range
        if (feature.properties.startDate <= sliderEndYear && feature.properties.endDate >= sliderStartYear) {
            // If not already on map, add to map
            if (!markersOnMapFeatures.includes(feature)) {
                const marker = new PruneCluster.Marker(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                marker.data.properties = feature.properties;
                leafletView.RegisterMarker(marker);
                markersOnMapFeatures.push(feature);
                markersOnMapMarkers.push(marker);
            }
        } else {
            // Else if not in range and on map, remove from map
            if (markersOnMapFeatures.includes(feature)) {
                markersOnMapFeatures = markersOnMapFeatures.filter(item => item !== feature);
                const marker = markersOnMapMarkers.find(marker => marker.data.properties === feature.properties);
                markersOnMapMarkers = markersOnMapMarkers.filter(item => item !== marker);
                leafletView.RemoveMarkers([marker]);
            }
        }
    })
    leafletView.ProcessView();
}

// Add event listener for slider slide event
slider.noUiSlider.on('slide', function(values) {
    // Get current slider values
    let sliderStartYear = parseInt(values[0]);
    let sliderEndYear = parseInt(values[1]);

    filterMarkersByRange(sliderStartYear, sliderEndYear);
});

// Listen for window resize
window.addEventListener('resize', function() {
    map.setMinZoom(calculateMinZoom());
    mergeTooltips(document.getElementById('slider'), Math.floor(8600 / window.innerWidth), ' - ');
});