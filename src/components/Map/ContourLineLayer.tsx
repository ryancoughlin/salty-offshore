import { memo, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import type { Expression } from 'mapbox-gl';
import useMapStore from '../../store/useMapStore';
import { BreakInfo } from './BreakInfo';

const CONTOUR_SOURCE = 'contour-layer' as const;

interface ContourLineInfo {
    temperature: number;
    breakStrength: 'strong' | 'moderate' | 'weak';
    position: { x: number; y: number };
    length_nm: number;
}

interface ContourLineLayerProps {
    map: mapboxgl.Map;
}

export const ContourLineLayer = memo<ContourLineLayerProps>(({ map }) => {
    const { layerData } = useMapStore();
    const [contourLineInfo, setContourLineInfo] = useState<ContourLineInfo | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    useEffect(() => {
        if (!map) return;

        const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
            if (!e.features?.[0]) return;
            const feature = e.features[0];

            if (hoveredId !== null) {
                map.setFeatureState(
                    { source: CONTOUR_SOURCE, id: hoveredId },
                    { hover: false }
                );
            }

            const newHoverId = feature.id as number;
            setHoveredId(newHoverId);
            map.setFeatureState(
                { source: CONTOUR_SOURCE, id: newHoverId },
                { hover: true }
            );

            setContourLineInfo({
                temperature: feature.properties.value,
                breakStrength: feature.properties.break_strength ?? 'weak',
                position: { x: e.point.x, y: e.point.y },
                length_nm: feature.properties.length_nm ?? 0
            });
        };

        const handleMouseLeave = () => {
            if (hoveredId !== null) {
                map.setFeatureState(
                    { source: CONTOUR_SOURCE, id: hoveredId },
                    { hover: false }
                );
            }
            setHoveredId(null);
            setContourLineInfo(null);
        };

        map.on('mousemove', CONTOUR_SOURCE, handleMouseMove);
        map.on('mouseleave', CONTOUR_SOURCE, handleMouseLeave);

        return () => {
            if (hoveredId !== null) {
                map.setFeatureState(
                    { source: CONTOUR_SOURCE, id: hoveredId },
                    { hover: false }
                );
            }
            map.off('mousemove', CONTOUR_SOURCE, handleMouseMove);
            map.off('mouseleave', CONTOUR_SOURCE, handleMouseLeave);
        };
    }, [map, hoveredId]);

    if (!layerData?.contours) return null;

    return (
        <>
            <Source 
                id={CONTOUR_SOURCE}
                type="geojson"
                data={layerData.contours}
                generateId={true}
            >
                <Layer
                    id={CONTOUR_SOURCE}
                    type="line"
                    paint={{
                        'line-color': ['interpolate',
                            ['linear'],
                            ['get', 'value'],
                            44, '#356b95',
                            54, '#89d0e4',
                            56, '#b1e095',
                            58, '#ebf66b',
                            60, '#ffee4f',
                            65, '#fdaa1c',
                            70, '#e05a08',
                            72, '#cc3f0b',
                            75, '#9f2815'
                        ] as Expression,
                        'line-width': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            3,
                            ['match', ['get', 'break_strength'],
                                'strong', 3,
                                'moderate', 2,
                                1
                            ]
                        ] as Expression,
                        'line-opacity': 1
                    }}
                />
                <Layer
                id={`${CONTOUR_SOURCE}-labels`}
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
            {contourLineInfo && <BreakInfo info={contourLineInfo} />}
        </>
    );
});

ContourLineLayer.displayName = 'ContourLineLayer'; 