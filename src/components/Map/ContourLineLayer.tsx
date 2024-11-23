import { memo, useEffect, useState, useCallback } from 'react';
import { Source, Layer } from 'react-map-gl';
import type { Expression } from 'mapbox-gl';
import useMapStore from '../../store/useMapStore';
import { BreakInfo } from './BreakInfo';

const CONTOUR_SOURCE = 'contour-layer' as const;

interface ContourLineInfo {
    temperature: number;
    breakStrength: 'weak' | 'moderate' | 'strong' | null;
    position: { x: number; y: number };
    length_nm: number;
}

interface ContourLineProps {
    map: mapboxgl.Map;
}

interface Feature {
    properties: {
        value: number;
        break_strength: 'weak' | 'moderate' | 'strong' | null;
        length_nm: number;
    } | null;
}

export const ContourLineLayer = memo<ContourLineProps>(({ map }) => {
    const { layerData } = useMapStore();
    const [hoveredContourInfo, setHoveredContourInfo] = useState<ContourLineInfo | undefined>();
    const [hoveredFeatureId, setHoveredFeatureId] = useState<number | null>(null);

    const handleContourMouseMove = useCallback((e: mapboxgl.MapLayerMouseEvent) => {
        const feature = e.features?.[0] as Feature | undefined;
        
        if (!feature?.properties) {
            setHoveredContourInfo(undefined);
            return;
        }

        const { value, break_strength, length_nm } = feature.properties;

        if (value == null || break_strength == null || length_nm == null) {
            setHoveredContourInfo(undefined);
            return;
        }

        setHoveredContourInfo({
            temperature: value,
            breakStrength: break_strength,
            position: { x: e.point.x, y: e.point.y },
            length_nm
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredContourInfo(undefined);
        if (hoveredFeatureId !== null) {
            map?.setFeatureState(
                { source: CONTOUR_SOURCE, id: hoveredFeatureId },
                { hover: false }
            );
            setHoveredFeatureId(null);
        }
    }, [map, hoveredFeatureId]);

    useEffect(() => {
        if (!map) return;

        map.on('mousemove', CONTOUR_SOURCE, handleContourMouseMove);
        map.on('mouseleave', CONTOUR_SOURCE, handleMouseLeave);

        return () => {
            map.off('mousemove', CONTOUR_SOURCE, handleContourMouseMove);
            map.off('mouseleave', CONTOUR_SOURCE, handleMouseLeave);
        };
    }, [map, handleContourMouseMove, handleMouseLeave]);

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
            {hoveredContourInfo && (
                <BreakInfo 
                    info={hoveredContourInfo}
                />
            )}
        </>
    );
});

ContourLineLayer.displayName = 'ContourLineLayer'; 