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

const getTemperatureColor = (temp: number): string => {
    if (temp < 60) return '#0072C4';
    if (temp < 65) return '#1AA3FF';
    if (temp < 70) return '#30BF9A';
    if (temp < 72) return '#F0C649';
    return '#FF6B00';
};

const getLineWidth = (breakStrength: string, isKeyTemp: boolean): number => {
    if (isKeyTemp) return 3;
    switch (breakStrength) {
        case 'strong': return 3;
        case 'moderate': return 2;
        default: return 1;
    }
};

const getLineOpacity = (breakStrength: string, isKeyTemp: boolean): number => {
    let baseOpacity = isKeyTemp ? 0.1 : 0;
    switch (breakStrength) {
        case 'strong': return 1.0 + baseOpacity;
        case 'moderate': return 0.9 + baseOpacity;
        default: return 0.7 + baseOpacity;
    }
};

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
                            'fill-opacity': 0,
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

            {layerData?.contours && dataset.id === 'LEOACSPOSSTL3SnrtCDaily' && (
                <Source
                    key={`${sourceIds.contours}-source`}
                    id={sourceIds.contours}
                    type="geojson"
                    data={layerData.contours}
                >
                    {/* Base line layer with white outline for key temperatures */}
                    <Layer
                        id={`${sourceIds.contours}-glow`}
                        type="line"
                        filter={['==', ['get', 'is_key_temp'], true]}
                        paint={{
                            'line-color': '#ffffff',
                            'line-width': ['case',
                                ['get', 'is_key_temp'], 5,
                                3
                            ],
                            'line-opacity': 0.5
                        }}
                    />

                    {/* Main contour lines */}
                    <Layer
                        id={sourceIds.contours}
                        type="line"
                        paint={{
                            'line-color': ['interpolate',
                                ['linear'],
                                ['get', 'value'],
                                60, '#0072C4',
                                65, '#1AA3FF',
                                70, '#30BF9A',
                                72, '#F0C649',
                                75, '#FF6B00'
                            ],
                            'line-width': ['case',
                                ['get', 'is_key_temp'], 3,
                                ['match',
                                    ['get', 'break_strength'],
                                    'strong', 3,
                                    'moderate', 2,
                                    1
                                ]
                            ],
                            'line-opacity': ['case',
                                ['get', 'is_key_temp'],
                                ['match',
                                    ['get', 'break_strength'],
                                    'strong', 1.1,
                                    'moderate', 1.0,
                                    0.8
                                ],
                                ['match',
                                    ['get', 'break_strength'],
                                    'strong', 1.0,
                                    'moderate', 0.9,
                                    0.7
                                ]
                            ],
                            'line-dasharray': ['match',
                                ['get', 'break_strength'],
                                'moderate', ['literal', [5, 5]],
                                ['literal', [1]]
                            ]
                        }}
                    />

                    {/* Temperature labels */}
                    <Layer
                        id={`${sourceIds.contours}-labels`}
                        type="symbol"
                        filter={['any',
                            ['==', ['get', 'is_key_temp'], true],
                            ['==', ['get', 'break_strength'], 'strong']
                        ]}
                        paint={{
                            'text-color': '#000000',
                            'text-halo-color': '#ffffff',
                            'text-halo-width': 2
                        }}
                        layout={{
                            'symbol-placement': 'line',
                            'text-field': ['concat',
                                ['number-format', ['get', 'value'],
                                    { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }
                                ],
                                '°F'
                            ],
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