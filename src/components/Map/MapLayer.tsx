import { memo } from 'react';
import { Source, Layer } from 'react-map-gl';
import useMapStore from '../../store/useMapStore';
import { ContourLineLayer } from './ContourLineLayer';

// Memoize static layer configurations
const baseLayer = {
    id: 'data-layer',
    type: 'fill' as const,
    source: 'data-layer',
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
    
    // Add debug log
    console.log('MapLayer render:', {
        hasLayerData: !!layerData,
        layerDataContent: layerData,
        selectedRegion
    });

    if (!layerData || !selectedRegion) return null;

    return (
        <>
            <Source id="data-layer" type="geojson" data={layerData.data}>
                <Layer {...baseLayer} />
            </Source>

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

            {layerData.contours && (
                <ContourLineLayer map={map} />
            )}
        </>
    );
});

MapLayer.displayName = 'MapLayer'; 