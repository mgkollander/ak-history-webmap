/* ---------- CALCULATE MINIMUM ZOOM ---------- */

export const CLIENT_WIDTH = 768;
export const SMALL_SCREEN_ZOOM = 5;
export const LARGE_SCREEN_ZOOM = 4;

/* ---------- MAP HANDLING ---------- */

export const MAX_BOUNDS = [[46.56, -189.14], [73.15, -123.93]];
export const INITIAL_COORDINATES = [64.793, -153.040];
export const MAX_BOUNDS_VISCOSITY = 0.5;
export const MAX_ZOOM = 8;
export const OTM_TILE_LAYER = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
export const OSM_TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const ST_TILE_LAYER = 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png';
export const STB_TILE_LAYER = 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png';


/* ---------- MARKER HANDLING ---------- */

export const CLUSTER_SIZE = 50;
export const ICON_SIZE = [40, 40];
export const ICON_ANCHOR = [3, 30];
export const POPUP_ANCHOR = [17, -28];

/* ---------- SLIDER HANDLING ---------- */

export const INITIAL_END_YEAR = 1800;
export const MIN_START_YEAR = 1750;
export const MAX_END_YEAR = 2020;
export const TOOLTIPS_CONSTANT = 8600;