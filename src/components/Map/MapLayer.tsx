import { memo } from 'react';
import { Source, Layer } from 'react-map-gl';
import useMapStore from '../../store/useMapStore';
import { ContourLineLayer } from './ContourLineLayer';

// Memoize static layer configurations
const baseLayer = {
    id: 'data-layer',
    type: 'fill' as const,
    paint: {
        'fill-opacity': 0,
        'fill-color': '#007cbf'
    }
};

const imageLayer = {
    id: 'image-layer',
    type: 'raster' as const,
    paint: {
        'raster-opacity': 1,
        'raster-fade-duration': 0
    }
};

interface MapLayerProps {
    map: mapboxgl.Map;
}

export const MapLayer = memo<MapLayerProps>(({ map }) => {
    const { layerData, selectedRegion } = useMapStore();

    if (!layerData || !selectedRegion) return null;

    return (
        <>
            {/* Base data layer */}
            <Source type="geojson" data={layerData.data}>
                <Layer {...baseLayer} />
            </Source>

            {/* Image layer */}
            {layerData.image && (
                <Source 
                    type="image" 
                    url={layerData.image}
                    coordinates={[
                        [selectedRegion.bounds[0][0], selectedRegion.bounds[1][1]],
                        [selectedRegion.bounds[1][0], selectedRegion.bounds[1][1]],
                        [selectedRegion.bounds[1][0], selectedRegion.bounds[0][1]],
                        [selectedRegion.bounds[0][0], selectedRegion.bounds[0][1]]
                    ]}
                >
                    <Layer {...imageLayer} />
                </Source>
            )}

            {/* Contour lines layer */}
            {layerData.contours && (
                <ContourLineLayer map={map} />
            )}
        </>
    );
});

MapLayer.displayName = 'MapLayer'; 