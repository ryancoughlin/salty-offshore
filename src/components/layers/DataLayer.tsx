import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useLayerData } from '../../hooks/useLayerData';
import type { Region } from '../../types/Region';
import type { DatasetId } from '../../types/Layer';

interface DataLayerProps {
  map: mapboxgl.Map;
  region: Region;
  datasetId: DatasetId;
  visible: boolean;
}

const DataLayer: React.FC<DataLayerProps> = ({
  map,
  region,
  datasetId,
  visible
}) => {
  const { image, geojson, loading, error } = useLayerData(region, datasetId, visible);

  // Handle image layer
  useEffect(() => {
    if (!image || loading) return;

    const sourceId = `${datasetId}-source`;
    const layerId = `${datasetId}-layer`;

    try {
      // Add image source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'image',
          url: image,
          coordinates: [
            [region.bounds[0][0], region.bounds[1][1]], // top left
            [region.bounds[1][0], region.bounds[1][1]], // top right
            [region.bounds[1][0], region.bounds[0][1]], // bottom right
            [region.bounds[0][0], region.bounds[0][1]]  // bottom left
          ]
        });
      }

      // Add or update layer
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          layout: {
            visibility: visible ? 'visible' : 'none'
          }
        });
      } else {
        map.setLayoutProperty(
          layerId, 
          'visibility', 
          visible ? 'visible' : 'none'
        );
      }
    } catch (err) {
      console.error('Error adding layer to map:', err);
    }

    // Cleanup
    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch (err) {
        console.error('Error cleaning up layer:', err);
      }
    };
  }, [map, image, visible, region, datasetId]);

  // Handle GeoJSON layer if needed
  useEffect(() => {
    if (!geojson || loading) return;

    const sourceId = `${datasetId}-geojson-source`;
    const layerId = `${datasetId}-geojson-layer`;

    // Similar pattern for GeoJSON layer...
    // Add implementation based on your GeoJSON data structure

  }, [map, geojson, visible, datasetId]);

  if (error) {
    console.error(`Error loading ${datasetId}:`, error);
  }

  return null;
};

export default DataLayer;
