import { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import type { LineLayer } from '@mapbox/mapbox-gl-style-spec';

interface GridControlProps {
    visible?: boolean;
    gridSize?: number;
    onGridSizeChange?: (size: number) => void;
}

export const GridControl: React.FC<GridControlProps> = ({
    visible = true,
    gridSize = 1,
    onGridSizeChange
}) => {
    const [gridLines, setGridLines] = useState<GeoJSON.FeatureCollection>({
        type: 'FeatureCollection',
        features: []
    });

    useEffect(() => {
        const features: GeoJSON.Feature[] = [];

        // Generate latitude lines
        for (let lat = -90; lat <= 90; lat += gridSize) {
            features.push({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [[-180, lat], [180, lat]]
                },
                properties: { type: 'latitude', value: lat }
            });
        }

        // Generate longitude lines
        for (let lon = -180; lon <= 180; lon += gridSize) {
            features.push({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [[lon, -90], [lon, 90]]
                },
                properties: { type: 'longitude', value: lon }
            });
        }

        setGridLines({ type: 'FeatureCollection', features });
    }, [gridSize]);

    const gridLayer: LineLayer = {
        id: 'grid-lines',
        type: 'line',
        source: 'grid-source',
        paint: {
            'line-color': '#000',
            'line-opacity': 0.2,
            'line-width': 1
        }
    };

    return (
        <>
            {visible && (
                <Source id="grid-source" type="geojson" data={gridLines}>
                    <Layer {...gridLayer} />
                </Source>
            )}
            <div className="absolute bottom-20 right-4 bg-white/90 backdrop-blur-sm rounded p-2">
                <label className="text-sm text-gray-700">
                    Grid Size (degrees):
                    <select
                        value={gridSize}
                        onChange={(e) => onGridSizeChange?.(Number(e.target.value))}
                        className="ml-2 p-1 rounded border"
                    >
                        <option value="0.5">0.5°</option>
                        <option value="1">1°</option>
                        <option value="5">5°</option>
                        <option value="10">10°</option>
                    </select>
                </label>
            </div>
        </>
    );
}; 