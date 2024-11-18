import { Source, Layer } from 'react-map-gl';
import { memo } from 'react';

interface BathymetryLayerProps {
    visible?: boolean;
}


export const BathymetryLayer = memo<BathymetryLayerProps>(({ visible = true }) => {
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
        type="line"  // Changed to "fill" to handle polygon (type 3) data
        source-layer="bathymetry"
        paint={{
            'line-color': '#0080ff',
            'line-width': 1,
            'line-opacity': visible ? 0.2 : 0
        }}
    />
</Source>
    );
});

BathymetryLayer.displayName = 'BathymetryLayer'; 