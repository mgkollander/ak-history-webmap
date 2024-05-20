import { map } from './map.js';

// Function to fetch GeoJSON data and add to map
export const fetchGeoJson = async () => {
    try {
        const response = await fetch('data/languageBounds.geojson');
        const data = await response.json();
        if (!data) {
            console.error('No data fetched from GeoJSON file.');
            window.alert('Error: No data was found. Please try again later.');
            return;
        }
        L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
                // Add popup
                if (feature.properties && feature.properties.LanguageName) {
                    layer.bindPopup(`<strong>Language:</strong> ${feature.properties.LanguageName}<br>
                                     <strong>Country:</strong> ${feature.properties.Country}<br>
                                     <strong>Family:</strong> ${feature.properties.Family}`);
                }
            },
        }).addTo(map);
    } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        window.alert('Error: Data was unable to be loaded. Please try again later.');
        throw error;
    }
};
