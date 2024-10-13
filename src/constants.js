/* ---------- CALCULATE MINIMUM ZOOM ---------- */

export const CLIENT_WIDTH = 768;
export const SMALL_SCREEN_ZOOM = 4;
export const LARGE_SCREEN_ZOOM = 3;

/* ---------- MAP HANDLING ---------- */

export const MAX_BOUNDS = [[44.47, -205.84], [74.64, -116.37]];
export const INITIAL_COORDINATES = [64.793, -153.040];
export const MAX_BOUNDS_VISCOSITY = 0.5;
export const MAX_ZOOM = 8;
const RESEARCH_CREDIT = ' | Made by <a href="credits.html" target="_blank">Dr. Maria Williams and co.</a>';
export const OTM_TILE_LAYER = ['https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', `© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | © <a href="https://opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)` + RESEARCH_CREDIT];
export const OSM_TILE_LAYER = ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', `© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`+ RESEARCH_CREDIT];
export const ST_TILE_LAYER = ['https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', `<a href="<a href="https://stamen.com/" target="_blank">Stamen Design</a> | <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> | <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> | <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>` + RESEARCH_CREDIT];
export const STB_TILE_LAYER = ['https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png', `<a href="<a href="https://stamen.com/" target="_blank">Stamen Design</a> | <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> | <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> | <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`+ RESEARCH_CREDIT];


/* ---------- MARKER HANDLING ---------- */

export const CLUSTER_SIZE = 50;
export const ICON_SIZE = [40, 40];
export const ICON_ANCHOR = [20, 20];
export const POPUP_ANCHOR = [0, -12];

/* ---------- SLIDER HANDLING ---------- */

export const INITIAL_END_YEAR = 2020;
export const MIN_START_YEAR = 1750;
export const MAX_END_YEAR = 2020;
export const TOOLTIPS_CONSTANT = 8600;
