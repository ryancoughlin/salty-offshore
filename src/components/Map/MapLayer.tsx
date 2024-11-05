import { Source, Layer } from 'react-map-gl';
import { useMemo, useCallback, useEffect } from 'react';
import useMapStore from '../../store/useMapStore';
import { BreakInfo } from './BreakInfo';

export const MapLayer: React.FC<{ map: mapboxgl.Map }> = ({ map }) => {
    const { layerData, loading, error, selectedRegion, selectedDataset, selectedDate, contourLineInfo, setContourLineInfo } = useMapStore();
    let hoveredStateId: string | null = null;

    const sourceIds = useMemo(() => ({
        data: `${selectedDataset?.id}-data`,
        contours: `${selectedDataset?.id}-contours`,
        image: `${selectedDataset?.id}-image`
    }), [selectedDataset?.id]);

    useEffect(() => {
        if (!layerData?.contours) return;

        // Add mouse events to the contour layer
        map.on('mousemove', sourceIds.contours, (e) => {
            if (e.features?.length) {
                if (hoveredStateId !== null) {
                    map.setFeatureState(
                        { source: sourceIds.contours, id: hoveredStateId },
                        { hover: false }
                    );
                }

                hoveredStateId = e.features[0].id as string;
                map.setFeatureState(
                    { source: sourceIds.contours, id: hoveredStateId },
                    { hover: true }
                );

                // Update hover info for BreakInfo component
                setContourLineInfo({
                    temperature: e.features[0].properties.value,
                    breakStrength: e.features[0].properties.break_strength,
                    position: { x: e.point.x, y: e.point.y }
                });
            }
        });

        map.on('mouseleave', sourceIds.contours, () => {
            if (hoveredStateId !== null) {
                map.setFeatureState(
                    { source: sourceIds.contours, id: hoveredStateId },
                    { hover: false }
                );
                setContourLineInfo(null);
            }
            hoveredStateId = null;
        });

        return () => {
            map.off('mousemove', sourceIds.contours);
            map.off('mouseleave', sourceIds.contours);
        };
    }, [layerData?.contours]);

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
                    generateId={true}
                >
                    <Layer
                        id={sourceIds.contours}
                        type="line"
                        paint={{
                            'line-color': ['interpolate',
                                ['linear'],
                                ['get', 'value'],
                                44, '#0043CE',  // Very cold
                                54, '#0072C4',  // Cold
                                60, '#30BF9A',  // Transition
                                65, '#F0C649',  // Prime fishing
                                70, '#FF6B00',  // Prime fishing
                                72, '#FF3333',  // Prime fishing
                                75, '#CC0000'   // Warm
                            ],
                            'line-width': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                4,  // Width when hovered
                                ['case',
                                    ['==', ['get', 'break_strength'], 'strong'],
                                    3,
                                    ['==', ['get', 'break_strength'], 'moderate'],
                                    2,
                                    1
                                ]
                            ],
                            'line-opacity': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                1,
                                ['match',
                                    ['get', 'break_strength'],
                                    'strong', 1,
                                    'moderate', 0.5,
                                    0.25
                                ]
                            ]
                        }}
                    />

                    {/* Temperature labels */}
                    <Layer
                        id={`${sourceIds.contours}-labels`}
                        type="symbol"
                        filter={['any',
                            ['==', ['get', 'is_key_temp'], false],
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
                            'symbol-spacing': 300
                        }}
                    />
                </Source>
            )}

            {contourLineInfo && (
                <BreakInfo info={contourLineInfo} />
            )}
        </>
    );
}; 