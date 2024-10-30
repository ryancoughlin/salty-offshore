import { Source, Layer } from 'react-map-gl';
import type { Dataset, Region } from '../../types/api';

interface MapLayerProps {
    region: Region;
    dataset: Dataset;
    visible: boolean;
    visibleLayers?: Set<string>;
    selectedDate: string;

}

export const MapLayer: React.FC<MapLayerProps> = ({
    region,
    dataset,
    visible,
    visibleLayers = new Set(),
    selectedDate
}) => {
    if (!visible || !selectedDate) return null;

    const dateEntry = dataset.dates.find(d => d.date === selectedDate);
    if (!dateEntry) return null;

    // Get coordinates for image bounds
    const [[minLng, minLat], [maxLng, maxLat]] = region.bounds;
    const coordinates = [
        [minLng, maxLat], // top-left
        [maxLng, maxLat], // top-right
        [maxLng, minLat], // bottom-right
        [minLng, minLat]  // bottom-left
    ];

    const isLayerVisible = (layerType: string): boolean => {
        return visibleLayers?.has(`${dataset.id}-${layerType}`) ?? false;
    };

    return (
        <>
            {/* Base Image Layer */}
            {dateEntry.layers.image && (
                <Source
                    id={`${dataset.id}-image-source`}
                    type="image"
                    url={dateEntry.layers.image}
                    coordinates={coordinates}
                >
                    <Layer
                        id={`${dataset.id}-image`}
                        type="raster"
                        paint={{
                            'raster-opacity': 0.5,
                            'raster-fade-duration': 0
                        }}
                    />
                </Source>
            )}

            {/* Contour Layer */}
            {dateEntry.layers.contours && isLayerVisible('contours') && (
                <Source
                    id={`${dataset.id}-contours-source`}
                    type="geojson"
                    data={dateEntry.layers.contours}
                >
                    {/* Main contour lines */}
                    <Layer
                        id={`${dataset.id}-contours-line`}
                        type="line"
                        paint={{
                            'line-color': '#FF0000',
                            'line-width': 1,
                            'line-opacity': 1
                        }}
                    />

                    {/* Contour labels */}
                    <Layer
                        id={`${dataset.id}-contours-label`}
                        type="symbol"
                        layout={{
                            'text-field': [
                                'concat',
                                ['number-format', ['get', 'value'], { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }],
                                '°C'  // Add unit
                            ],
                            'text-font': ['Open Sans Regular'],
                            'symbol-placement': 'line',
                            'text-size': 12,
                            'text-allow-overlap': false,
                            'text-padding': 5
                        }}
                        paint={{
                            'text-color': '#FF0000',
                            'text-halo-color': '#FFFFFF',
                            'text-halo-width': 2
                        }}
                    />
                </Source>
            )}
        </>
    );
}; 