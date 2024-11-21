import { Layer, Source } from 'react-map-gl';
import spots from '../../utils/spots.json';

interface SpotLayerProps {
    visible?: boolean;
    minZoom?: number;
    maxZoom?: number;
}

export const SpotLayer: React.FC<SpotLayerProps> = ({
    visible = true,
    minZoom = 6,
    maxZoom = 14
}) => {
    return (
        <Source id="spots-source" type="geojson" data={spots}>
            <Layer
                id="spots-labels"
                type="symbol"
                slot="top"
                minzoom={minZoom}
                maxzoom={maxZoom}
                layout={{
                    'text-field': ['get', 'name'],
                    'text-size': 12,
                    'text-anchor': 'center',
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                    'visibility': visible ? 'visible' : 'none',
                    'text-offset': [0, 0],
                    'text-justify': 'center',
                    'text-max-width': 12,
                    'symbol-placement': 'point',
                    'symbol-z-order': 'source'
                }}
                paint={{
                    'text-color': '#ffffff',
                    'text-halo-color': 'rgba(0, 0, 0, 0.5)',
                    'text-halo-width': 2,
                    'text-opacity': 1
                }}
            />
        </Source>
    );
}; 