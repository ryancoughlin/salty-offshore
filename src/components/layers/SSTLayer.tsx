import { FC, useEffect } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { Region } from '../../types/Layer';
import { useSST } from '../../hooks/useSST';
import { useBaseLayer } from './BaseLayer';

interface SSTLayerProps {
  map: mapboxgl.Map;
  region: Region;
  visible: boolean;
  showContours: boolean;
}

export const SSTLayer: FC<SSTLayerProps> = ({
  map,
  region,
  visible,
  showContours
}) => {
  const { image, contours, loading } = useSST(region, visible, showContours);

  // Base SST layer
  useBaseLayer({
    map,
    sourceId: 'sst-source',
    layerId: 'sst-layer',
    image,
    visible,
    region
  });

  // Contour layer management
  useEffect(() => {
    if (!contours || !visible || !showContours) return;

    const sourceId = 'sst-contours-source';
    const layerId = 'sst-contours-layer';

    const addContourLayer = () => {
      // Add source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: contours
        });
      }

      // Add layer if it doesn't exist
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            visibility: 'visible',
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#000',
            'line-width': 1,
            'line-opacity': 0.5
          }
        }, (map as any).landMaskLayer);
      } else {
        map.setLayoutProperty(
          layerId,
          'visibility',
          visible && showContours ? 'visible' : 'none'
        );
      }
    };

    try {
      addContourLayer();
    } catch (err) {
      console.error('Error adding contour layer:', err);
    }

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, contours, visible, showContours]);

  return null;
};

export default SSTLayer;
