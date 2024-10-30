import { Source, Layer } from 'react-map-gl';
import { useDatasetLayers } from '../../hooks/useDatasetLayers';
import type { Dataset, Region } from '../../types/api';
import type { LayerType } from '../../types/core';

interface MapLayerProps {
    dataset: Dataset;
    visible: boolean;
    selectedDate: string | null;
    region: Region;
    visibleLayers: Set<string>;
}

export const MapLayer: React.FC<MapLayerProps> = ({
    dataset,
    visible,
    selectedDate,
    region,
    visibleLayers
}) => {
    const { layerUrls } = useDatasetLayers(dataset, selectedDate);

    if (!layerUrls) return null;

    const isLayerVisible = (layerType: LayerType): boolean => {
        // Base visibility check - if dataset isn't visible, no layers should show
        if (!visible) return false;

        // For image and data layers, show when dataset is visible
        if (layerType === 'image' || layerType === 'data') {
            return true;
        }

        // For additional layers (like contours), check if specifically enabled
        const layerId = `${dataset.id}-${layerType}`;
        return visibleLayers.has(layerId);
    };

    const [[minLng, minLat], [maxLng, maxLat]] = region.bounds;
    const coordinates = [
        [minLng, maxLat],
        [maxLng, maxLat],
        [maxLng, minLat],
        [minLng, minLat]
    ];

    return (
        <>
            {/* Image Layer */}
            {layerUrls.image && isLayerVisible('image') && (
                <Source
                    id={`${dataset.id}-image-source`}
                    type="image"
                    url={layerUrls.image}
                    coordinates={coordinates}
                >
                    <Layer
                        id={`${dataset.id}-image`}
                        type="raster"
                        paint={{
                            'raster-opacity': 0.7
                        }}
                    />
                </Source>
            )}

            {/* Data Layer (GeoJSON) */}
            {layerUrls.data && isLayerVisible('data') && (
                <Source
                    id={`${dataset.id}-data-source`}
                    type="geojson"
                    data={layerUrls.data}
                >
                    <Layer
                        id={`${dataset.id}-data`}
                        type="fill"
                        paint={{
                            'fill-opacity': 0
                        }}
                    />
                </Source>
            )}

            {/* Contours Layer */}
            {layerUrls.contours && isLayerVisible('contours') && (
                <Source
                    id={`${dataset.id}-contours-source`}
                    type="geojson"
                    data={layerUrls.contours}
                >
                    <Layer
                        id={`${dataset.id}-contours`}
                        type="line"
                        paint={{
                            'line-color': '#FF0000',
                            'line-width': 1,
                            'line-opacity': 0.8
                        }}
                    />
                </Source>
            )}
        </>
    );
}; 