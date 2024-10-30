import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useLayerData } from '../../hooks/useLayerData';
import type { Region } from '../../types/Region';
import type { Layer } from '../../types/Layer';
import type { SelectedDate } from '../../types/date';

interface MapLayerProps {
  map: mapboxgl.Map;
  region: Region;
  layer: Layer;
  selectedDate: SelectedDate;
}

const MapLayer: React.FC<MapLayerProps> = ({
  map,
  region,
  layer,
  selectedDate
}) => {
  const { path, loading, error } = useLayerData(region, layer, selectedDate);
  const sourceId = `${layer.id}-source`;
  const layerId = `${layer.id}-layer`;

  useEffect(() => {
    if (loading || error || !path) return;

    // Add source
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: layer.type === 'contour' ? 'geojson' : 'raster',
        tiles: layer.type === 'image' ? [`${path}/{z}/{x}/{y}`] : undefined,
        data: layer.type === 'contour' ? path : undefined,
      });
    }

    // Add layer
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: layer.type === 'image' ? 'raster' : 'line',
        source: sourceId,
        paint: layer.type === 'image' ? {
          'raster-opacity': layer.visible ? layer.opacity : 0
        } : {
          'line-color': '#FF0000',
          'line-width': 1,
          'line-opacity': layer.visible ? layer.opacity : 0
        }
      });
    }

    return () => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, path, loading, error, layer, sourceId, layerId]);

  // Update layer visibility and opacity when they change
  useEffect(() => {
    if (!map.getLayer(layerId)) return;

    if (layer.type === 'image') {
      map.setPaintProperty(layerId, 'raster-opacity', layer.visible ? layer.opacity : 0);
    } else {
      map.setPaintProperty(layerId, 'line-opacity', layer.visible ? layer.opacity : 0);
    }
  }, [map, layerId, layer.visible, layer.opacity, layer.type]);

  return null;
};

export default MapLayer;
