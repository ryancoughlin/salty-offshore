import { memo, useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';
import useMapStore from '../../store/useMapStore';
import { ContourLineLayer } from './ContourLineLayer';
import WaveHeightLayer from './WaveHeightLayer';
import type { FeatureCollection, Point } from 'geojson';
import type { WaveProperties } from '../../types/WaveProperties';

const imageLayer = {
    id: 'image-layer',
    slot: 'middle',
    type: 'raster' as const,
    paint: {
        'raster-opacity': 1,
        'raster-fade-duration': 150
    }
};

interface MapLayerProps {
    map: mapboxgl.Map;
}

export const MapLayer = memo<MapLayerProps>(({ map }) => {
    const { layerData, selectedRegion, selectedDataset } = useMapStore();

    // Memoize the coordinates calculation
    const imageCoordinates = useMemo(() => {
        if (!selectedRegion) return null;
        return [
            [selectedRegion.bounds[0][0], selectedRegion.bounds[1][1]],
            [selectedRegion.bounds[1][0], selectedRegion.bounds[1][1]],
            [selectedRegion.bounds[1][0], selectedRegion.bounds[0][1]],
            [selectedRegion.bounds[0][0], selectedRegion.bounds[0][1]]
        ];
    }, [selectedRegion]);

    const isWaveDataset = selectedDataset?.id === "CMEMS_Global_Waves_Daily";

    if (!layerData || !selectedRegion || !imageCoordinates) {
        return null;
    }

    return (
        <>
            {isWaveDataset && layerData.data && (
                <WaveHeightLayer 
                    map={map}
                    data={layerData.data as unknown as FeatureCollection<Point, WaveProperties>}
                />
            )}

            {layerData.image && (
                <Source 
                    type="image" 
                    url={layerData.image}
                    coordinates={imageCoordinates}
                >
                    <Layer {...imageLayer} />
                </Source>
            )}

            <Source 
                id="data-layer" 
                type="geojson" 
                data={layerData.data}
                tolerance={3}
                maxzoom={22}
            >
                <Layer
                    id="data-layer"
                    type="fill"
                    paint={{
                        'fill-opacity': 0,
                        'fill-color': '#007cbf'
                    }}
                />
            </Source>

            {layerData.contours && (
                <ContourLineLayer map={map} />
            )}
        </>
    );
});

MapLayer.displayName = 'MapLayer'; 