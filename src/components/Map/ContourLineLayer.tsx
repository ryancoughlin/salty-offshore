import { Source, Layer } from 'react-map-gl';
import useMapStore from '../../store/useMapStore';

interface ContourLineLayerProps {
    sourceIds: {
        contours: string;
    };
}

export const ContourLineLayer: React.FC<ContourLineLayerProps> = ({
    sourceIds,
}) => {
    const { layerData } = useMapStore();

    if (!layerData?.contours) return null;

    return (
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
                        44, '#356b95',  // Very cold
                        54, '#89d0e4',  // Cold (yellow)
                        56, '#b1e095',  // Cold (light yellow)
                        58, '#ebf66b',  // Cold (light yellow)
                        60, '#ffee4f',  // Transition
                        65, '#fdaa1c',  // Prime fishing
                        70, '#e05a08',  // Prime fishing
                        72, '#cc3f0b',  // Prime fishing
                        75, '#9f2815'   // Warm
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
                            'moderate', 1,
                            1
                        ]
                    ]
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
}; 