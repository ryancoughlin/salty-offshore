import { memo, useEffect } from 'react';
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

    useEffect(() => {
        console.log('MapLayer render:', {
            hasLayerData: !!layerData,
            hasRegion: !!selectedRegion,
            datasetId: selectedDataset?.id,
            hasImage: !!layerData?.image,
            hasContours: !!layerData?.contours,
            hasData: !!layerData?.data
        });
    }, [layerData, selectedRegion, selectedDataset]);

    if (!layerData || !selectedRegion) {
        console.log('MapLayer: Missing required data');
        return null;
    }

    const isWaveDataset = selectedDataset?.id === "CMEMS_Global_Waves_Daily";

    return (
        <>
            <Source id="data-layer" type="geojson" data={layerData.data}>
                <Layer
                    id="data-layer"
                    type="fill"
                    paint={{
                        'fill-opacity': 0,
                        'fill-color': '#007cbf'
                    }}
                />
            </Source>

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