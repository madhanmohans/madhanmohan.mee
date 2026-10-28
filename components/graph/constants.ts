export const GRAPH_HEIGHT = 200;
export const HIT_RADIUS = 12;
export const MIN_ZOOM = 0.3;
export const MAX_ZOOM = 4;
export const MAX_SIMULATION_TICKS = 120;

export const GRAPH_API_URL = '/api/graph';

export const TWO_D_GRAPH_NODE_RADIUS = 5;

// Force configuration
export const LINK_DISTANCE = 30;
export const LINK_STRENGTH = 0.5;
export const CHARGE_STRENGTH = 1;
export const CENTER_STRENGTH = 0.3;
export const COLLIDE_RADIUS = 50;

// Simulation
export const ALPHA_DECAY = 0.0228;
export const VELOCITY_DECAY = 0.4;
export const COOLDOWN_TIME = 4000;
export const WARMUP_TICKS_BG = 50;
export const WARMUP_TICKS = 100;

// Rendering
export const DEFAULT_LINK_COLOR = 'rgba(107,107,107,0.3)';
export const HIGHLIGHT_COLOR = '#10e6e9';
export const LABEL_FONT_SIZE_2D = 14;
export const LABEL_FONT_SIZE_3D = 20;
export const LINK_WIDTH_BG = 1;
export const LINK_WIDTH = 2;

// Zoom
export const ZOOM_FACTOR = 1.4;
// force-graph's default 2D zoom is 4 / cbrt(nodeCount); the 2D view opens
// this many times more zoomed in
export const INITIAL_ZOOM_2D = 2;
export const ZOOM_PER_NODE_2D = 4;
// 3d-force-graph's default camera distance is cbrt(nodeCount) * 170; the 3D
// view opens this much closer
export const INITIAL_ZOOM_3D = 3;
export const CAMERA_DISTANCE_PER_NODE_3D = 170;
export const ZOOM_ANIMATION_DURATION = 300;
export const ZOOM_TO_FIT_DURATION = 400;
export const ZOOM_TO_FIT_PADDING = 60;

// Tooltip
export const TOOLTIP_ANIMATION_DURATION = 0.12;
export const TOOLTIP_OFFSET = 4;

// View transition name shared by the home hover graph and the /graph frame
export const SECOND_BRAIN_GRAPH_TRANSITION = 'second-brain-graph';
