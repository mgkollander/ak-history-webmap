import { MIN_START_YEAR, INITIAL_END_YEAR, MAX_END_YEAR, TOOLTIPS_CONSTANT } from './constants.js';
import { markerData, markersOnMapFeatures, markersOnMapMarkers, prune, createMarker, removeMarkerFromMap, addMarkerToMap } from './marker.js';
import { map, calculateMinZoom } from './map.js';
import { mergeTooltips } from './mergeTooltips.js';

var sliderStartYear = MIN_START_YEAR;
var sliderEndYear = MAX_END_YEAR;

// Function to initialize range slider
const initializeSlider = () => {
    const slider = document.getElementById('slider');

    // If slider already initialized, destroy it
    if (slider.noUiSlider) {
        slider.noUiSlider.destroy();
    }

    // Create new slider
    noUiSlider.create(slider, {
        start: [sliderStartYear, sliderEndYear],
        connect: true,
        tooltips: [true, true],
        step: 1,
        format: { to: value => Math.round(value), from: value => value },
        range: { 'min': MIN_START_YEAR, 'max': MAX_END_YEAR }
    });

    // Set title attribute for each slider handle
    let sliderHandles = document.querySelectorAll('.noUi-handle-lower, .noUi-handle-upper');
    sliderHandles.forEach((handle, index) => {
        let handleName = index == 0 ? 'Lower' : 'Upper';
        handle.setAttribute('title', `${handleName} slider control for adjusting markers on map`);
    });

    // Merge slider tooltips when overlapping
    mergeTooltips(slider, Math.floor(TOOLTIPS_CONSTANT / window.innerWidth), ' - ');

    // Add event listener for slider slide event
    slider.noUiSlider.on('slide', function(values) {
        // Get current slider values
        sliderStartYear = parseInt(values[0]);
        sliderEndYear = parseInt(values[1]);

        filterMarkersByRange(sliderStartYear, sliderEndYear);
    });
    
    return slider;
};

// Initialize slider
let slider = initializeSlider();

// Function to filter markers by slider range
const filterMarkersByRange = (sliderStartYear, sliderEndYear) => {
    markerData.features.forEach(feature => {
        // If in range
        if (feature.properties.startDate <= sliderEndYear && feature.properties.endDate >= sliderStartYear) {
            // If not already on map, add to map
            if (!markersOnMapFeatures.includes(feature)) {
                const marker = createMarker(feature);
                addMarkerToMap(feature, marker);
            }
        } else {
            // Else if not in range and on map, remove from map
            if (markersOnMapFeatures.includes(feature)) {
                const marker = markersOnMapMarkers.find(marker => marker.data.properties === feature.properties);
                removeMarkerFromMap(feature, marker);
            }
        }
    });
    prune.ProcessView();
};

// Listen for window resize
window.addEventListener('resize', function() {
    map.setMinZoom(calculateMinZoom());
    slider = initializeSlider();
});