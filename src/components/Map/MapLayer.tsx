import { Source, Layer } from 'react-map-gl';
import type { Dataset, Region } from '../../types/api';
import type { LayerType, SourceType, LayerStyleType } from '../../types/core';

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

    return (
        <>
            {dataset.supportedLayers.map(layerType => {
                const layerUrl = dateEntry.layers[layerType];
                if (!layerUrl) return null;

                const sourceId = `${dataset.id}-${layerType}-source`;
                const layerId = `${dataset.id}-${layerType}-layer`;

                const [[minLng, minLat], [maxLng, maxLat]] = region.bounds;
                const coordinates = [
                    [minLng, maxLat],
                    [maxLng, maxLat],
                    [maxLng, minLat],
                    [minLng, minLat]
                ];

                const sourceProps = getSourceProps(layerType, layerUrl, coordinates);
                const layerProps = getLayerProps(layerType, opacity);

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

const getSourceProps = (layerType: LayerType, url: string, coordinates?: number[][]) => {
    const sourceType: SourceType = layerType === 'image' ? 'image' : 'geojson';

    return {
        type: sourceType,
        ...(layerType === 'image'
            ? { url, coordinates }
            : { data: url }
        )
    };
};

const getLayerProps = (layerType: LayerType, opacity: number) => {
    const styleType: LayerStyleType = layerType === 'image' ? 'raster' : 'line';

    return {
        type: styleType,
        paint: layerType === 'image'
            ? {
                'raster-opacity': opacity,
                'raster-fade-duration': 0
            }
            : {
                'line-color': '#FF0000',
                'line-width': 1,
                'line-opacity': opacity
            }
    };
}; 