// Function to calculate minimum zoom based on screen width
function calculateMinZoom() {
    return document.documentElement.clientWidth < 768 ? 4 : 5;
}

// Function to filter markers based on current slider years
function filterMarkers() {
    geojsonLayer.eachLayer(layer => {
        const { startDate, endDate } = layer.feature.properties;
        const inRange = startDate <= currentEndYear && endDate >= currentStartYear;
        const fading = fadingMarkers.has(layer);
        const icon = layer._icon;

        if (inRange) {
            if (fading) {
                fadingMarkers.delete(layer);
                if (icon) icon.classList.remove('fade-out');
            }
            if (icon && !icon.classList.contains('fade-in')) {
                icon.classList.add('fade-in');
                setTimeout(() => icon.classList.add('show'), 10);
            }
            map.addLayer(layer);
        } else {
            if (!fading) {
                fadingMarkers.add(layer);
                if (icon) {
                    icon.classList.add('fade-out');
                    setTimeout(() => {
                        if (fadingMarkers.has(layer)) {
                            map.removeLayer(layer);
                            fadingMarkers.delete(layer);
                        }
                    }, 500);
                }
            }
            if (icon && icon.classList.contains('fade-in')) {
                icon.classList.remove('fade-in', 'show');
            }
        }
    });
}

// Function to initialize the slider
function initializeSlider() {
    const slider = document.getElementById('slider');

    // Destroy existing slider instance
    if (slider.noUiSlider) slider.noUiSlider.destroy();

    noUiSlider.create(slider, {
        start: [currentStartYear, currentEndYear],
        connect: true,
        tooltips: [true, true],
        format: { to: function (value) { return Math.round(value); },
                  from: function (value) { return value; } 
        },
        range: { 'min': 1750, 'max': 2024 }
    });

    mergeTooltips(slider, Math.floor(9800/window.innerWidth), ' - ');

    // Listen for slider changes
    slider.noUiSlider.on('update', function(values) {
        currentStartYear = parseInt(values[0]);
        currentEndYear = parseInt(values[1]);
        filterMarkers();
    });
}

// Map initialization
const map = L.map('map', {
    maxBounds: [[46.56, -189.14],[73.15, -123.93]],
    maxBoundsViscosity: 0.5,
    minZoom: calculateMinZoom(),
    maxZoom: 8,
    attributionControl: false
}).setView([64.793, -153.040], calculateMinZoom());

// Add tile layer to map
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png').addTo(map);

// Set slider handle start and end years
let [currentStartYear, currentEndYear] = [1750, 2024];

// Set to keep track of markers currently fading out
let fadingMarkers = new Set();

// Load GeoJSON data
let geojsonLayer = L.geoJSON(null, {
    onEachFeature: function(feature, layer) {
        const properties = feature.properties;
        const title = properties.startDate + " - " + properties.endDate;

        let popupContent = "<h3>" + title + "</h3>";
        popupContent += properties.description;
        var maxWidth = feature.properties.hasImage ? "auto" : feature.properties.maxWidth || 200;
        if (properties.hasImage) {
            popupContent += "<img src='" + properties.imageUrl + "' alt='Marker Image' style='max-width: 200px;'>";
        }

        // Bind popup to marker layer
        layer.bindPopup(popupContent, { maxWidth : maxWidth });

        // Create a custom icon for the marker with no shadow
        var customIcon = L.icon({
            iconUrl: 'data/icons/pin.png', // URL to the marker icon image
            iconSize: [64, 64],         // Size of the icon image
            iconAnchor: [10, 30],       // Anchor point of the icon image
            popupAnchor: [22, -28],      // Popup anchor relative to the icon
            shadowUrl: '',              // No shadow URL
            shadowSize: [0, 0],         // No shadow size
            shadowAnchor: [0, 0]        // No shadow anchor
        });

        // Set the custom icon for the marker
        layer.setIcon(customIcon);
    }
}).addTo(map);

// Fetch GeoJSON data and add it to the map
fetch('markerData.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonLayer.addData(data);
        filterMarkers(); // Filter markers initially
});

// Initialize slider
initializeSlider();

// Listen for window resize event : reinitialize slider and calculate minZoom
window.addEventListener('resize', function() {
    map.setMinZoom(calculateMinZoom());
    initializeSlider();
});