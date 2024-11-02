import { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';

interface GridProps {
    visible?: boolean;
    gridSize: number;
}

export const Grid: React.FC<GridProps> = ({
    visible = true,
    gridSize
}) => {
    const [gridLines, setGridLines] = useState<GeoJSON.FeatureCollection>({
        type: 'FeatureCollection',
        features: []
    });

    useEffect(() => {
        // Generate latitude lines
        const latitudeLines = Array.from(
            { length: Math.floor(180 / gridSize) + 1 },
            (_, i) => -90 + i * gridSize
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
            { length: Math.floor(360 / gridSize) + 1 },
            (_, i) => -180 + i * gridSize
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
    }, [gridSize]);


    return visible ? (
        <Source id="grid-source" type="geojson" data={gridLines}>
            <Layer
                id="grid-lines"
                type="line"
                source="grid-source"
                paint={{
                    "line-color": "#000",
                    "line-opacity": 0.2,
                    "line-width": 1
                }}
            />
        </Source>
    ) : null;
}; 