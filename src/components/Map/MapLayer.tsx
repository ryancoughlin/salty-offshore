import { Source, Layer } from 'react-map-gl';
import { useMemo } from 'react';
import useMapStore from '../../store/useMapStore';

export const MapLayer: React.FC = () => {
    const { layerData, loading, error, selectedRegion, selectedDataset, selectedDate } = useMapStore();

    const sourceIds = useMemo(() => ({
        data: `${selectedDataset?.id}-data`,
        contours: `${selectedDataset?.id}-contours`,
        image: `${selectedDataset?.id}-image`
    }), [selectedDataset?.id]);

    if (!selectedDataset || !selectedRegion || !selectedDate || loading || error || !layerData) {
        return null;
    }

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
                        [selectedRegion.bounds[0][0], selectedRegion.bounds[1][1]],
                        [selectedRegion.bounds[1][0], selectedRegion.bounds[1][1]],
                        [selectedRegion.bounds[1][0], selectedRegion.bounds[0][1]],
                        [selectedRegion.bounds[0][0], selectedRegion.bounds[0][1]]
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

            {layerData?.contours && selectedDataset?.id === 'LEOACSPOSSTL3SnrtCDaily' && (
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