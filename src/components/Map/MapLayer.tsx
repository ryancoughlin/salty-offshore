import { useMemo, useCallback, useEffect } from 'react';
import useMapStore from '../../store/useMapStore';
import { BreakInfo } from './BreakInfo';

export const MapLayer: React.FC<{ map: mapboxgl.Map }> = ({ map }) => {
    const {
        layerData,
        selectedRegion,
        selectedDataset,
        selectedDate,
        contourLineInfo
    } = useMapStore();

    // Memoize layer configuration to prevent unnecessary recalculations
    const layerConfig = useMemo(() => {
        if (!selectedDataset?.id || !layerData?.image || !selectedRegion) {
            return null;
        }

        return {
            sourceId: `${selectedDataset.id}-source`,
            layerId: `${selectedDataset.id}-layer`,
            imageUrl: layerData.image,
            coordinates: [
                [selectedRegion.bounds[0][0], selectedRegion.bounds[1][1]],
                [selectedRegion.bounds[1][0], selectedRegion.bounds[1][1]],
                [selectedRegion.bounds[1][0], selectedRegion.bounds[0][1]],
                [selectedRegion.bounds[0][0], selectedRegion.bounds[0][1]]
            ]
        };
    }, [selectedDataset?.id, layerData?.image, selectedRegion]);

    // Handle layer cleanup
    const removeLayer = useCallback(() => {
        if (!map) return;

        // Remove existing layers and sources
        const layers = map.getStyle().layers || [];
        layers.forEach(layer => {
            if (layer.id.endsWith('-layer')) {
                map.removeLayer(layer.id);
            }
        });

        // Remove sources
        const sources = Object.keys(map.getStyle().sources || {});
        sources.forEach(sourceId => {
            if (sourceId.endsWith('-source')) {
                map.removeSource(sourceId);
            }
        });
    }, [map]);

    // Handle layer management
    useEffect(() => {
        if (!map || !layerConfig) return;

        // Remove existing layers first
        removeLayer();

        try {
            // Add new source and layer
            map.addSource(layerConfig.sourceId, {
                type: 'image',
                url: layerConfig.imageUrl,
                coordinates: layerConfig.coordinates
            });

            map.addLayer({
                id: layerConfig.layerId,
                type: 'raster',
                source: layerConfig.sourceId,
                paint: {
                    'raster-opacity': 1,
                    'raster-fade-duration': 0,
                    'raster-resampling': 'nearest'
                }
            });
        } catch (error) {
            console.error('Error managing map layer:', error);
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            removeLayer();
        };
    }, [map, layerConfig, removeLayer]);

    if (!map || !selectedDataset || !selectedRegion || !selectedDate || !layerData) {
        return null;
    }

    return (
        <>
            {contourLineInfo && <BreakInfo info={contourLineInfo} />}
        </>
    );
}; 