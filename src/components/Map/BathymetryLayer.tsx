import { Source, Layer } from 'react-map-gl';
import { memo } from 'react';

export const BathymetryLayer = memo(() => {
    return (
        <Source
            id="bathymetry"
            type="vector"
            tiles={[
                'http://157.245.10.94/assets/bathymetry/tiles/static/{z}/{x}/{y}.pbf'
            ]}
        >
            <Layer
                id="bathymetry-layer"
                type="line"
                source-layer="bathymetry"
                paint={{
                    'line-color': '#000',
                    'line-width': 1,
                    'line-opacity': 0.1
                }}
            />
        </Source>
    );
});

BathymetryLayer.displayName = 'BathymetryLayer'; 