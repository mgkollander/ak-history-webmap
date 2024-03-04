
/* ---------- INITIALIZE MAP ---------- */

// Initialize map
var map = L.map('map', {
    maxBounds: [[46.56, -189.14],  // SW corner
                [73.15, -123.93]], // NE corner
    maxBoundsViscosity: 1.0,
    minZoom: calculateMinZoom()
}).setView([64.793,-153.040], calculateMinZoom())

// OSM tiles
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 8,
    attribution: '&copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC-BY-SA</a>) | Add names + data source'
}).addTo(map)

// Calculate minZoom based on screen width
function calculateMinZoom() {
    var width = document.documentElement.clientWidth
    if (width < 768) {
        return 4
    } else {
        return 5
    }
}

// Listen for screen resize event
window.addEventListener('resize', function(event) {
    map.setMinZoom(calculateMinZoom())
})

/* ---------- LOAD MAP MARKERS ---------- */

// Load GeoJSON data and create markers
fetch('markerdata.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        // Create marker
        var marker = L.marker(latlng);
        // Create popup content

        var popupContent = `
          <div>
            <h3>${feature.properties.description}</h3>
            <p>${feature.properties.startDate} - ${feature.properties.endDate}</p>
          </div>
        `;

        // If maker has image, add it to the popup
        if (feature.properties.hasImage) {
            popupContent += `<img src="${feature.properties.imageUrl}" alt="Marker Image" style="max-width: 200px;">`
            maxWidth = "auto" // Markers with images must use "auto"
        } else {
            maxWidth = feature.properties.maxWidth || 200 // Markers without images use feature maxWidth or fallback to 200 if it's not specified
        }
        
        marker.bindPopup(popupContent, {
            maxWidth: maxWidth
        })
        return marker;
      }
    }).addTo(map);
  });
