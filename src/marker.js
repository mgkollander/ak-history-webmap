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

var estimateCircle = null;

// Marker configuration
prune.PrepareLeafletMarker = (marker, data) => {
    marker.setIcon(L.icon({
        iconUrl: 'static/marker.png',
        iconSize: ICON_SIZE,
        iconAnchor: ICON_ANCHOR,
        popupAnchor: POPUP_ANCHOR
    }));

    let {startDate, endDate, description, extLink, extLinkTxt, extLink2, extLink2Txt, extLink3, extLink3Txt, imageUrl, imageText} = data.properties;
    let dateTitle = startDate == endDate ? startDate : `${startDate} - ${endDate}`;

    let popupContent =  `
        <div class="popup-content">
            <b class="date-title">${dateTitle}</b><br><br>${description}
            ${extLink ? (extLink.includes("youtube.com") || extLink.includes("youtu.be") ?
                `<br><br><iframe src="${extLink}" title="Youtube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` :
                `<br><br><a href="${extLink}" target="_blank">→ ${extLinkTxt}</a>`) : ''}
            ${extLink2 ? (extLink2.includes("youtube.com") || extLink2.includes("youtu.be") ?
                `<br><br><iframe src="${extLink2}" title="Youtube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` :
                `<br><br><a href="${extLink2}" target="_blank">→ ${extLink2Txt}</a>`) : ''}
            ${extLink3 ? (extLink3.includes("youtube.com") || extLink3.includes("youtu.be") ?
                `<br><br><iframe src="${extLink3}" title="Youtube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` :
                `<br><br><a href="${extLink3}" target="_blank">→ ${extLink3Txt}</a>`) : ''}
        </div>
    `;

    let popup = L.popup({
        autoPan: false,
        keepInView: false,
        maxHeight: 330,
        maxWidth: 315
    }).setContent(popupContent);

    marker.bindPopup(popup);

    // Below code fixes an issue with images ignoring 'maxHeight' when first opened -- weird solution but it works
    marker.on('popupopen', () => {
        if (imageUrl) {
            let img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                let updatedContent = `
                    <div class="popup-content">
                        <b class="date-title">${dateTitle}</b><br><br>${description}
                        ${extLink ? (extLink.includes("youtube.com") || extLink.includes("youtu.be") ?
                            `<br><br><iframe src="${extLink}" title="Youtube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` :
                            `<br><br><a href="${extLink}" target="_blank">→ ${extLinkTxt}</a>`) : ''}
                        ${extLink2 ? (extLink2.includes("youtube.com") || extLink2.includes("youtu.be") ?
                            `<br><br><iframe src="${extLink2}" title="Youtube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` :
                            `<br><br><a href="${extLink2}" target="_blank">→ ${extLink2Txt}</a>`) : ''}
                        ${extLink3 ? (extLink3.includes("youtube.com") || extLink3.includes("youtu.be") ?
                            `<br><br><iframe src="${extLink3}" title="Youtube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` :
                            `<br><br><a href="${extLink3}" target="_blank">→ ${extLink3Txt}</a>`) : ''}
                        <br><br><figure><img src="${imageUrl}" class="image-style"></figure>
                        ${imageText ? `<div style="font-size: 12px;">${imageText}</div>` : ''}
                    </div>
                `;
                popup.setContent(updatedContent);
            };
        }
    });

    // "show relevant region" idea
    // markers have "region" attribute, boolean
    // if true, marker will also have attributes giving details
    // feed into a function that can turn details into a polygon
    // display polygon on clicking a point, remove on some other trigger?

    /*
    // Click event listener to focus on selected marker
    marker.on('click', () => {
        //map.setView(marker.getLatLng(), map.getZoom(), { animate: true });
        if(estimateCircle) estimateCircle.remove();
        estimateCircle = L.circle(marker.getLatLng(), {radius: 20000});
        estimateCircle.addTo(map);
    }); 
    */
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