import { memo, useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';

// Constants
const GRID_SOURCE = 'grid-source' as const;
const GRID_LAYER = 'grid-lines' as const;

const GRID_CONSTANTS = {
    SIZE: 1, // Static grid size in degrees
    LINE_STYLE: {
        COLOR: "#000",
        WIDTH: 1
    }
} as const;

interface GridProps {
    visible?: boolean;
    opacity?: number;
}

export const Grid = memo<GridProps>(({
    visible = true,
    opacity = 0.1
}) => {
    // Memoize grid lines generation
    const gridLines = useMemo(() => {
        // Generate latitude lines
        const latitudeLines = Array.from(
            { length: Math.floor(180 / GRID_CONSTANTS.SIZE) + 1 },
            (_, i) => -90 + i * GRID_CONSTANTS.SIZE
        ).map(lat => ({
            type: 'Feature' as const,
            geometry: {
                type: 'LineString' as const,
                coordinates: [[-180, lat], [180, lat]]
            },
            properties: { type: 'latitude', value: lat }
        }));

        // Generate longitude lines 
        const longitudeLines = Array.from(
            { length: Math.floor(360 / GRID_CONSTANTS.SIZE) + 1 },
            (_, i) => -180 + i * GRID_CONSTANTS.SIZE
        ).map(lon => ({
            type: 'Feature' as const,
            geometry: {
                type: 'LineString' as const,
                coordinates: [[lon, -90], [lon, 90]]
            },
            properties: { type: 'longitude', value: lon }
        }));

        return {
            type: 'FeatureCollection',
            features: [...latitudeLines, ...longitudeLines]
        } as const;
    }, []); // Empty dependency array since GRID_CONSTANTS.SIZE is static

    if (!visible) return null;

    return (
        <Source
            id={GRID_SOURCE}
            type="geojson"
            data={gridLines}
        >
            <Layer
                id={GRID_LAYER}
                type="line"
                source={GRID_SOURCE}
                paint={{
                    "line-color": GRID_CONSTANTS.LINE_STYLE.COLOR,
                    "line-opacity": opacity,
                    "line-width": GRID_CONSTANTS.LINE_STYLE.WIDTH
                }}
            />
        </Source>
    );
});

Grid.displayName = 'Grid'; 