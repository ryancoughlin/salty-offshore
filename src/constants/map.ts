export const MAP_CONSTANTS = {
    DEFAULT_VIEW: {
        longitude: -71.0,
        latitude: 39.0,
        zoom: 6,
        duration: 2400
    },
    ZOOM_LIMITS: {
        MAX: 10,
        MIN: 5
    },
    REGION_FIT: {
        padding: 10,
        duration: 2400,
        maxZoom: 7
    }
} as const; 