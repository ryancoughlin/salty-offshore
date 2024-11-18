import { memo, useEffect } from 'react';
import { Source, Layer } from 'react-map-gl';
import useMapStore from '../../store/useMapStore';

const CONTOUR_SOURCE = 'main-contours' as const;

interface ContourLineLayerProps {
    map: mapboxgl.Map;
    onMouseMove?: (e: mapboxgl.MapLayerMouseEvent) => void;
}

export const ContourLineLayer = memo<ContourLineLayerProps>(({ map, onMouseMove }) => {
    const { layerData, selectedDataset } = useMapStore();
    // Update source data only when dataset changes
    useEffect(() => {
        if (!map || !layerData?.contours) return;

        const source = map.getSource(CONTOUR_SOURCE) as mapboxgl.GeoJSONSource;
        if (source) {
            source.setData(layerData.contours);
        }
    }, [map, selectedDataset]); // Only update when dataset changes

    // Setup mouse events once
    useEffect(() => {
        if (!map || !onMouseMove) return;
        
        map.on('mousemove', CONTOUR_SOURCE, onMouseMove);
        return () => {
            map.off('mousemove', CONTOUR_SOURCE, onMouseMove);
        };
    }, [map]); // Only setup events once

    // Initial source/layer setup
    if (!layerData?.contours || map.getSource(CONTOUR_SOURCE)) {
        return null;
    }

    return (
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
                    ],
                    'line-width': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        3,
                        ['match', ['get', 'break_strength'],
                            'strong', 3,
                            'moderate', 2,
                            1
                        ]
                    ],
                    'line-dasharray': [
                        'match',
                        ['get', 'break_strength'],
                        'strong', [1],
                        'moderate', [1],
                        [4, 4]
                    ],
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
    );
});

ContourLineLayer.displayName = 'ContourLineLayer'; 