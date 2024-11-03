import { Source, Layer } from 'react-map-gl';
import type { Dataset, Region } from '../../types/api';
import type { ISODateString } from '../../types/date';
import { useDatasetLayers } from '../../hooks/useDatasetLayers';
import { useMemo, useEffect } from 'react';

interface ContourProperties {
    value: number;
}

interface MapLayerProps {
    region: Region;
    dataset: Dataset;
    selectedDate: ISODateString;
}

export const MapLayer: React.FC<MapLayerProps> = ({
    region,
    dataset,
    selectedDate,
}) => {
    console.log('MapLayer ENTRY:', {
        regionId: region?.id,
        datasetId: dataset?.id,
        selectedDate,
        bounds: region?.bounds
    });

    const { layerData, loading, error } = useDatasetLayers(dataset, selectedDate);

    console.log('MapLayer DATA:', {
        hasDataset: dataset,
        hasData: !!layerData?.data,
        hasContours: !!layerData?.contours,
        hasImage: !!layerData?.image,
        loading,
        error
    });

    const sourceIds = useMemo(() => ({
        data: `${dataset.id}-data`,
        contours: `${dataset.id}-contours`,
        image: `${dataset.id}-image`
    }), [dataset.id]);

    if (!dataset || !region) {
        console.log('MapLayer: Missing required props');
        return null;
    }

    if (loading) {
        console.log('MapLayer: Loading...');
        return null;
    }

    if (error) {
        console.error('MapLayer: Error:', error);
        return null;
    }

    if (!layerData) {
        console.log('MapLayer: No layer data');
        return null;
    }

    console.log('MapLayer RENDER:', {
        sourceIds,
        dataFeatures: layerData.data?.features?.length,
        contourFeatures: layerData.contours?.features?.length,
        imageUrl: layerData.image
    });

    return (
        <>
            {layerData.data && (
                <Source
                    key={`${sourceIds.data}-source`}
                    id={sourceIds.data}
                    type="geojson"
                    data={layerData.data}
                >
                    <Layer
                        id={sourceIds.data}
                        type="fill"
                        paint={{
                            'fill-opacity': 0.5,
                            'fill-color': '#007cbf'
                        }}
                    />
                </Source>
            )}

            {layerData.image && (
                <Source
                    key={`${sourceIds.image}-source`}
                    id={sourceIds.image}
                    type="image"
                    url={layerData.image}
                    coordinates={[
                        [region.bounds[0][0], region.bounds[1][1]],
                        [region.bounds[1][0], region.bounds[1][1]],
                        [region.bounds[1][0], region.bounds[0][1]],
                        [region.bounds[0][0], region.bounds[0][1]]
                    ]}
                >
                    <Layer
                        id={sourceIds.image}
                        type="raster"
                        paint={{
                            'raster-opacity': 1,
                            'raster-fade-duration': 0
                        }}
                    />
                </Source>
            )}

            {layerData.contours && (
                <Source
                    key={`${sourceIds.contours}-source`}
                    id={sourceIds.contours}
                    type="geojson"
                    data={layerData.contours}
                >
                    <Layer
                        id={sourceIds.contours}
                        type="line"
                        paint={{
                            'line-color': '#000000',
                            'line-opacity': 0.2,
                            'line-width': 2
                        }}
                    />
                    <Layer
                        id={`${sourceIds.contours}-labels`}
                        type="symbol"
                        paint={{
                            'text-color': '#000000',
                            'text-halo-color': '#ffffff',
                            'text-halo-width': 2
                        }}
                        layout={{
                            'symbol-placement': 'line',
                            'text-field': ['concat', ['number-format', ['get', 'value'], { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }], '°F'],
                            'text-font': ['Arial Unicode MS Bold'],
                            'text-size': 14,
                            'text-max-angle': 30,
                            'text-allow-overlap': false,
                            'symbol-spacing': 250
                        }}
                    />
                </Source>
            )}
        </>
    );
}; 