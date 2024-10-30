import { Source, Layer } from 'react-map-gl';
import type { Dataset, Region } from '../../types/api';

interface MapLayerProps {
    region: Region;
    dataset: Dataset;
    visible: boolean;
    visibleLayers?: Set<string>;
    selectedDate: string;
    opacity?: number;
}

export const MapLayer: React.FC<MapLayerProps> = ({
    region,
    dataset,
    visible,
    visibleLayers = new Set(),
    selectedDate,
    opacity = 1
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
                            'raster-opacity': opacity,
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
                    <Layer
                        id={`${dataset.id}-contours`}
                        type="line"
                        paint={{
                            'line-color': '#FF0000',
                            'line-width': 1.5,
                            'line-opacity': opacity * 0.8
                        }}
                    />
                </Source>
            )}
        </>
    );
}; 