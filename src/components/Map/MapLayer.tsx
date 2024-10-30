import { Source, Layer } from 'react-map-gl';
import type { Dataset, Region } from '../../types/api';
import type { LayerType } from '../../types/core';

interface MapLayerProps {
    region: Region;
    dataset: Dataset;
    visible: boolean;
    selectedDate: string;
    opacity?: number;
}

export const MapLayer: React.FC<MapLayerProps> = ({
    region,
    dataset,
    visible,
    selectedDate,
    opacity = 1
}) => {
    if (!visible || !selectedDate) return null;

    const dateEntry = dataset.dates.find(d => d.date === selectedDate);
    if (!dateEntry) return null;

    // Add debugging
    console.log('MapLayer Render:', {
        datasetId: dataset.id,
        visible,
        selectedDate,
        dateEntry,
        supportedLayers: dataset.supportedLayers,
        bounds: region.bounds
    });

    // Render a Source/Layer pair for each supported layer type
    return (
        <>
            {dataset.supportedLayers.map(layerType => {
                const layerUrl = dateEntry.layers[layerType];
                if (!layerUrl) return null;

                const sourceId = `${dataset.id}-${layerType}-source`;
                const layerId = `${dataset.id}-${layerType}-layer`;

                const sourceProps = layerType === 'image'
                    ? {
                        type: 'image' as const,
                        url: layerUrl,
                        coordinates: region.bounds
                    }
                    : {
                        type: 'geojson' as const,
                        data: layerUrl
                    };

                const layerProps = layerType === 'image'
                    ? {
                        type: 'raster' as const,
                        paint: {
                            'raster-opacity': opacity,
                            'raster-fade-duration': 0
                        }
                    }
                    : {
                        type: 'line' as const,
                        paint: {
                            'line-color': '#FF0000',
                            'line-width': 1,
                            'line-opacity': opacity
                        }
                    };

                return (
                    <Source
                        key={sourceId}
                        id={sourceId}
                        {...sourceProps}
                    >
                        <Layer
                            id={layerId}
                            {...layerProps}
                        />
                    </Source>
                );
            })}
        </>
    );
}; 