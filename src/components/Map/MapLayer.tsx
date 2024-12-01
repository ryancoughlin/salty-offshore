import { memo, useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';
import useMapStore from '../../store/useMapStore';
import { useLayerStore } from '../../store/useLayerStore';
import { ContourLineLayer } from './ContourLineLayer';
import WaveHeightLayer from './WaveHeightLayer';
import type { FeatureCollection, Point } from 'geojson';
import type { WaveProperties } from '../../types/WaveProperties';

interface MapLayerProps {
    map: mapboxgl.Map;
}

export const MapLayer = memo<MapLayerProps>(({ map }) => {
    const { layerData, selectedRegion, selectedDataset } = useMapStore();
    const { layerSettings } = useLayerStore();

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
    const imageSettings = layerSettings.get('image');
    const dataSettings = layerSettings.get('data');
    const threeDSettings = layerSettings.get('3d');
    const contourSettings = layerSettings.get('contours');

    if (!layerData || !selectedRegion || !imageCoordinates) {
        return null;
    }

    return (
        <>
            {isWaveDataset && layerData.data && threeDSettings?.visible && (
                <WaveHeightLayer
                    map={map}
                    data={layerData.data as unknown as FeatureCollection<Point, WaveProperties>}
                    opacity={threeDSettings.opacity}
                />
            )}

            {layerData.image && imageSettings?.visible && (
                <Source
                    type="image"
                    url={layerData.image}
                    coordinates={imageCoordinates}
                >
                    <Layer
                        id="image-layer"
                        slot="middle"
                        type="raster"
                        paint={{
                            'raster-opacity': imageSettings.opacity,
                            'raster-fade-duration': 150
                        }}
                    />
                </Source>
            )}

            {dataSettings?.visible && (
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
                            'fill-opacity': dataSettings.opacity,
                            'fill-color': '#007cbf'
                        }}
                    />
                </Source>
            )}

            {layerData.contours && (
                <ContourLineLayer
                    map={map}
                    visible={contourSettings?.visible ?? true}
                    opacity={contourSettings?.opacity ?? 0.7}
                />
            )}
        </>
    );
});

MapLayer.displayName = 'MapLayer'; 