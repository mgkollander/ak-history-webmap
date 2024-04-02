// Function to calculate minimum zoom based on screen width
const calculateMinZoom = () => document.documentElement.clientWidth < 768 ? 4 : 5;

// Function to filter markers based on current slider years
const filterMarkers = () => {
    geojsonLayer.eachLayer(layer => {
        const { startDate, endDate } = layer.feature.properties;
        const inRange = startDate <= currentEndYear && endDate >= currentStartYear;

        if (inRange && !map.hasLayer(layer)) {
            map.addLayer(layer);
        } else if (!inRange && map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    });
};

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

    // Listen for slider changes
    slider.noUiSlider.on('update', values => {
        currentStartYear = parseInt(values[0]);
        currentEndYear = parseInt(values[1]);
        filterMarkers();
    });
};

// Function to initialize map
const initializeMap = () => {
    const map = L.map('map', {
        maxBounds: [[46.56, -189.14],[73.15, -123.93]],
        maxBoundsViscosity: 0.5,
        minZoom: calculateMinZoom(),
        maxZoom: 8,
        attributionControl: false
    }).setView([64.793, -153.040], calculateMinZoom());

    // Add tile layer to map
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png').addTo(map);

    return map;
};

// Function to load GeoJSON data
const loadGeoJSON = (map) => {
    const geojsonLayer = L.geoJSON().addTo(map);
    const customIcon = L.icon({
        iconUrl: 'data/icons/pin.png',
        iconSize: [50, 50],
        iconAnchor: [3, 30],
        popupAnchor: [22, -28],
    });
    geojsonLayer.on('layeradd', (event) => {
        const layer = event.layer;
        layer.setIcon(customIcon);
    });
    fetch('markerData.geojson')
        .then(response => response.json())
        .then(data => {
            geojsonLayer.addData(data);
            filterMarkers();
        });
    return geojsonLayer;
};

const map = initializeMap();
const geojsonLayer = loadGeoJSON(map);

let [currentStartYear, currentEndYear] = [1750, 2020];
initializeSlider();

// Listen for window resize event (with debouncing)
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