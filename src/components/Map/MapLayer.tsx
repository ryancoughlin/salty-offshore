import { Source, Layer } from 'react-map-gl';
import { useDatasetLayers } from '../../hooks/useDatasetLayers';
import type { Dataset, Region } from '../../types/api';
import { useMemo, useEffect } from 'react';
import type { Feature, FeatureCollection } from 'geojson';

interface MapLayerProps {
    dataset: Dataset;
    visible: boolean;
    selectedDate: string;
    region: Region;
}

const isValidGeoJSON = (data: any): data is FeatureCollection => {
    console.log('Validating GeoJSON:', {
        hasData: !!data,
        type: data?.type,
        hasFeatures: Array.isArray(data?.features),
        featureCount: data?.features?.length
    });

    return data &&
        typeof data === 'object' &&
        data.type === 'FeatureCollection' &&
        Array.isArray(data.features) &&
        data.features.length > 0;
};

const isValidImageUrl = (url: any): url is string => {
    return typeof url === 'string' && url.startsWith('http');
};

export const MapLayer: React.FC<MapLayerProps> = ({
    dataset,
    visible,
    selectedDate,
    region,
}) => {
    const { layerData } = useDatasetLayers(dataset, selectedDate);

    // Early return if not visible or no layer data
    if (!visible || !layerData) {
        console.log('Layer not rendered:', {
            datasetId: dataset.id,
            visible,
            hasLayerData: !!layerData
        });
        return null;
    }

    const [[minLng, minLat], [maxLng, maxLat]] = region.bounds;
    const coordinates = [
        [minLng, maxLat],
        [maxLng, maxLat],
        [maxLng, minLat],
        [minLng, minLat]
    ];

    return (
        <>
            {isValidGeoJSON(layerData.data) && (
                <Source id={`${dataset.id}-data`} type="geojson" data={layerData.data}>
                    <Layer
                        id={`${dataset.id}-data`}
                        type="fill"
                        paint={{ 'fill-opacity': 0 }}
                    />
                </Source>
            )}

            {layerData.image && (
                <Source
                    id={`${dataset.id}-image`}
                    type="image"
                    url={layerData.image}
                    coordinates={coordinates}
                >
                    <Layer
                        id={`${dataset.id}-image`}
                        type="raster"
                        paint={{ 'raster-opacity': 1 }}
                    />
                </Source>
            )}

            {isValidGeoJSON(layerData.contours) && (
                <Source id={`${dataset.id}-contours`} type="geojson" data={layerData.contours}>
                    <Layer
                        id={`${dataset.id}-contours`}
                        type="line"
                        paint={{
                            'line-color': '#000',
                            'line-width': 1,
                            'line-opacity': 0.8
                        }}
                    />
                </Source>
            )}
        </>
    );
}; 