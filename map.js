// Initialize the map
function initializeMap() {
    var map = L.map('map', {
        maxBounds: [[46.56, -189.14],  // SW corner
					[73.15, -123.93]], // NE corner
        maxBoundsViscosity: 1.0,
        minZoom: calculateMinZoom()
    }).setView([64.793, -153.040], calculateMinZoom());

	// OSM layer
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 8,
        attribution: '&copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC-BY-SA</a>) | Add names + data source'
    }).addTo(map);

    // Listen for screen resize event
    window.addEventListener('resize', function(event) {
        map.setMinZoom(calculateMinZoom());
    });

    return map;
}

// Calculate minZoom based on screen width
function calculateMinZoom() {
    var width = document.documentElement.clientWidth;
    return width < 768 ? 4 : 5;
}

// Load GeoJSON data and create markers
function loadMarkers(map) {
    fetch('markerdata.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch marker data');
            }
            return response.json();
        })
        .then(data => {
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng);
                    var popupContent = `
                        <div>
                            <h3>${feature.properties.description}</h3>
                            <p>${feature.properties.startDate} - ${feature.properties.endDate}</p>
                        </div>`;

                    var maxWidth = feature.properties.hasImage ? "auto" : feature.properties.maxWidth || 200;
                    if (feature.properties.hasImage) {
                        popupContent += `<img src="${feature.properties.imageUrl}" alt="Marker Image" style="max-width: 200px;">`;
                    }
                    
                    marker.bindPopup(popupContent, { maxWidth: maxWidth });

                    // Add click event listener to marker, pan to on click
                    marker.on('click', function() {
                        map.panTo(marker.getLatLng());
                    });

                    return marker;
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error loading marker data:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    var map = initializeMap();
    loadMarkers(map);
});
