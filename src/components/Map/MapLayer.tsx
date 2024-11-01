import { Source, Layer } from 'react-map-gl';
import type { Dataset, Region } from '../../types/api';
import type { ISODateString } from '../../types/date';
import { useDatasetLayers } from '../../hooks/useDatasetLayers';
import { useMemo } from 'react';

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
    const { layerData } = useDatasetLayers(dataset, selectedDate);

    const sourceIds = useMemo(() => ({
        data: `${dataset.id}-data`,
        contours: `${dataset.id}-contours`,
        image: `${dataset.id}-image`
    }), [dataset.id]);

    const coordinates = useMemo(() => {
        const [[minLng, minLat], [maxLng, maxLat]] = region.bounds;
        return [
            [minLng, maxLat],
            [maxLng, maxLat],
            [maxLng, minLat],
            [minLng, minLat]
        ];
    }, [region.bounds]);

    if (!layerData) return null;

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
                            'fill-opacity': 0
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
                            'line-color': '#000',
                            'line-opacity': 0.3,
                            'line-width': 1
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
                    coordinates={coordinates}
                >
                    <Layer
                        id={sourceIds.image}
                        type="raster"
                        paint={{
                            'raster-opacity': 1
                        }}
                    />
                </Source>
            )}
        </>
    );
}; 