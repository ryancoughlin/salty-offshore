import { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';

// Constants
const GRID_CONSTANTS = {
    SIZE: 1, // Static grid size in degrees
    LINE_STYLE: {
        COLOR: "#000",
        OPACITY: 0.1,
        WIDTH: 1
    }
} as const;

interface GridProps {
    visible?: boolean;
}

export const Grid: React.FC<GridProps> = ({ visible = true }) => {
    const [gridLines, setGridLines] = useState<GeoJSON.FeatureCollection>({
        type: 'FeatureCollection',
        features: []
    });

    useEffect(() => {
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

        setGridLines({
            type: 'FeatureCollection',
            features: [...latitudeLines, ...longitudeLines]
        });
    }, []); // Empty dependency array since GRID_CONSTANTS.SIZE is static

    return visible ? (
        <Source id="grid-source" type="geojson" data={gridLines}>
            <Layer
                id="grid-lines"
                type="line"
                source="grid-source"
                paint={{
                    "line-color": GRID_CONSTANTS.LINE_STYLE.COLOR,
                    "line-opacity": GRID_CONSTANTS.LINE_STYLE.OPACITY,
                    "line-width": GRID_CONSTANTS.LINE_STYLE.WIDTH
                }}
            />
        </Source>
    ) : null;
}; 