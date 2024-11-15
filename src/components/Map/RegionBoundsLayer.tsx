import { Layer, Source } from 'react-map-gl';
import type { LngLatBoundsLike } from 'mapbox-gl';

interface RegionBoundsLayerProps {
    bounds: LngLatBoundsLike;
}

export const RegionBoundsLayer: React.FC<RegionBoundsLayerProps> = ({ bounds }) => {
    const boundsGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [bounds[0][0], bounds[0][1]],
                [bounds[1][0], bounds[0][1]],
                [bounds[1][0], bounds[1][1]],
                [bounds[0][0], bounds[1][1]],
                [bounds[0][0], bounds[0][1]]
            ]]
        }
    };

    return (
        <Source
            id="region-bounds"
            type="geojson"
            data={boundsGeoJSON as GeoJSON.Feature}
        >
            <Layer
                id="region-bounds-line"
                type="line"
                paint={{
                    'line-color': '#000000',
                    'line-width': 2,
                    'line-opacity': 0.8
                }}
            />
        </Source>
    );
}; 