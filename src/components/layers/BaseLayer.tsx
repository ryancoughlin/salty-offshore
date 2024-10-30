import { useEffect } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { Region } from '../../types/Layer';

interface BaseLayerProps {
  map: mapboxgl.Map;
  sourceId: string;
  layerId: string;
  image?: string;
  visible: boolean;
  region: Region;
}

export const useBaseLayer = ({
  map,
  sourceId,
  layerId,
  image,
  visible,
  region
}: BaseLayerProps): void => {
  useEffect(() => {
    if (!image) return;

    const addLayer = () => {
      // Add source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'image',
          url: image,
          coordinates: [
            [region.bounds[0][0], region.bounds[1][1]],
            [region.bounds[1][0], region.bounds[1][1]],
            [region.bounds[1][0], region.bounds[0][1]],
            [region.bounds[0][0], region.bounds[0][1]]
          ]
        });
      }

      // Add layer if it doesn't exist
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          layout: {
            visibility: visible ? 'visible' : 'none'
          },
          paint: {
            'raster-opacity': 0.8,
            'raster-resampling': 'linear'
          }
        }, (map as any).landMaskLayer);
      } else {
        map.setLayoutProperty(
          layerId,
          'visibility',
          visible ? 'visible' : 'none'
        );
      }
    };

    try {
      addLayer();
    } catch (err) {
      console.error('Error managing layer:', err);
    }

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, sourceId, layerId, image, visible, region]);
};
