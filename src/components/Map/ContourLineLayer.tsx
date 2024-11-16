import { memo } from 'react';
import { Source, Layer } from 'react-map-gl';
import useMapStore from '../../store/useMapStore';

interface ContourLineLayerProps {
    sourceIds: {
        contours: string;
    };
}

export const ContourLineLayer = memo<ContourLineLayerProps>(({ sourceIds }) => {
    const { layerData } = useMapStore();

    if (!layerData?.contours) return null;

    return (
        <Source
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
                        'strong', [1], // solid line
                        'moderate', [1], // solid line
                        [4, 4] // dashed line for minor breaks
                    ],
                    'line-opacity': 1
                }}
            />

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
    );
});

ContourLineLayer.displayName = 'ContourLineLayer'; 