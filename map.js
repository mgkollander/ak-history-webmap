// Function to calculate minimimum zoom based on current screen width
const calculateMinZoom = () => document.documentElement.clientWidth < 768 ? 4 : 5;

// Function to initialize the slider
const initializeSlider = () => {
    const slider = document.getElementById('slider');

    // Destroy existing slider instance
    if (slider.noUiSlider) slider.noUiSlider.destroy();

    noUiSlider.create(slider, {
        start: [1750, 2020],
        connect: true,
        tooltips: [true, true],
        format: { to: value => Math.round(value), from: value => value },
        range: { 'min': 1750, 'max': 2020 }
    });

    mergeTooltips(slider, Math.floor(8600 / window.innerWidth), ' - ');
    return slider;
};

// Function to load GeoJSON marker data
const loadGeoJSON = (map) => {
    let leafletView = new PruneClusterForLeaflet();
    leafletView.Cluster.Size = 160;

    leafletView.PrepareLeafletMarker = function(leafletMarker, data) {
        let popupContent = "<b>" + data.properties.startDate + ' - ' + data.properties.endDate + "</b><br>" + data.properties.description;
        const customIcon = L.icon({
            iconUrl: 'data/icons/pin.png',
            iconSize: [50, 50],
            iconAnchor: [3, 30],
            popupAnchor: [22, -28]
        });
        leafletMarker.setIcon(customIcon);
        leafletMarker.bindPopup(popupContent);
    };
    let pruneClusterLayer = L.layerGroup();

    fetch('markerData.geojson')
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                let marker = new PruneCluster.Marker(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                marker.data.properties = feature.properties;
                leafletView.RegisterMarker(marker);
            });
            pruneClusterLayer.addLayer(leafletView);
            map.addLayer(pruneClusterLayer);
    });
}

const map = L.map('map', {
    maxBounds:[[46.56, -189.14],[73.15, -123.93]],
    maxBoundsViscosity: 0.5,
    minZoom: calculateMinZoom(),
    maxZoom: 8,
    attributionControl: false
}).setView([64.793, -153.040], calculateMinZoom());

// Add tile layer
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png').addTo(map);

const geojsonLayer = loadGeoJSON(map);

let [currentStartYear, currentEndYear] = [1750, 2020];
initializeSlider();

// Listen for changes in screen size (with debouncing)
window.addEventListener('resize', (() => {
    let timeoutId;
    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            map.setMinZoom(calculateMinZoom());
            initializeSlider();
        }, 250);
    };
})());