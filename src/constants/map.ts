export const MAP_CONSTANTS = {
    DEFAULT_VIEW: {
        longitude: -71.0,
        latitude: 39.0,
        zoom: 6,
    },
    ZOOM_LIMITS: {
        MAX: 10,
        MIN: 5
    },
    REGION_FIT: {
        PADDING: 10,
        DURATION: 2400,
        MAX_ZOOM: 7
    }
} as const; 