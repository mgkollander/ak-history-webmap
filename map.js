// Function to calculate minimum zoom based on current screen width
const calculateMinZoom = () => document.documentElement.clientWidth < 768 ? 4 : 5;

// Initialize map
const map = L.map('map', {
    maxBounds:[[46.56, -189.14],[73.15, -123.93]],
    maxBoundsViscosity: 0.5,
    minZoom: calculateMinZoom(),
    maxZoom: 8,
    attributionControl: false
}).setView([64.793, -153.040], calculateMinZoom());

// Add tile layer
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png').addTo(map);

// Initialize PruneCluster
const leafletView = new PruneClusterForLeaflet();
leafletView.Cluster.Size = 70;

// Customize marker behavior
leafletView.PrepareLeafletMarker = function(leafletMarker, data) {
    let popupContent = "<b>" + data.properties.startDate + ' - ' + data.properties.endDate + "</b><br>" + data.properties.description;
    const customIcon = L.icon({
        iconUrl: 'data/icons/pin.png',
        iconSize: [40, 40],
        iconAnchor: [3, 30],
        popupAnchor: [17, -28]
    });
    leafletMarker.setIcon(customIcon);
    leafletMarker.bindPopup(popupContent);
    leafletMarker.on("click", function() {
        map.panTo(leafletMarker.getLatLng());
    });
};

// Set custom cluster icon
leafletView.BuildLeafletClusterIcon = function(cluster) {
    var population = cluster.population;
    var icon = L.divIcon({
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

// Fetch GeoJSON and store marker data
fetch('markerData.geojson')
    .then(response => response.json())
    .then(data => {
        markerData = data.features; // Store marker data in the array
        // Add markers to PruneCluster
        markerData.forEach(feature => {
            let marker = new PruneCluster.Marker(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
            marker.data.properties = feature.properties;
            leafletView.RegisterMarker(marker);
        });
        // Add updated layer group to map
        pruneClusterLayer.addLayer(leafletView); 
        map.addLayer(pruneClusterLayer);
});

// Initialize slider
const slider = initializeSlider();

// Function to initialize range slider
function initializeSlider() {
    const slider = document.getElementById('slider');

    // Check if slider already exists, if so, just update its options
    if (slider.noUiSlider) {
        slider.noUiSlider.updateOptions({
            start: [1750, 2020],
            tooltips: [true, true],
            step: 1,
            range: { 'min': 1750, 'max': 2020 }
        });
    } else {
        noUiSlider.create(slider, {
            start: [1750, 2020],
            connect: true,
            tooltips: [true, true],
            step: 1,
            format: { to: value => Math.round(value), from: value => value },
            range: { 'min': 1750, 'max': 2020 }
        });
    }

    // Merge slider tooltips when overlapping
    mergeTooltips(slider, Math.floor(8600 / window.innerWidth), ' - ');

    return slider;
}

// Function to filter markers based on slider range
const filterMarkersByRange = (startYear, endYear) => {
    leafletView.RemoveMarkers();
    markerData.forEach(feature => {
        const markerStartDate = feature.properties.startDate;
        const markerEndDate = feature.properties.endDate;

        if (markerStartDate <= endYear && markerEndDate >= startYear) {
            const marker = new PruneCluster.Marker(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
            marker.data.properties = feature.properties;
            leafletView.RegisterMarker(marker);
        }
    });
};

// Add event listener for slider slide event
slider.noUiSlider.on('slide', function(values) {
    // Get current slider values
    let startYear = parseInt(values[0]);
    let endYear = parseInt(values[1]);
    
    // Call function to filter markers
    filterMarkersByRange(startYear, endYear);
    leafletView.ProcessView();
});

// Listen for window resize
window.addEventListener('resize', function() {
    map.setMinZoom(calculateMinZoom());
    initializeSlider();
});