import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Region } from '../types/Region';
import type { DatasetId } from '../types/Layer';

interface LayerData {
  image?: string;
  geojson?: string;
  loading: boolean;
  error?: string;
}

export const useLayerData = (
  region: Region | null,
  datasetId: DatasetId,
  visible: boolean
) => {
  const [layerData, setLayerData] = useState<LayerData>({
    loading: false
  });

  useEffect(() => {
    if (!region || !visible) {
      return;
    }

    const fetchLayerData = async () => {
      setLayerData(prev => ({ ...prev, loading: true }));
      
      try {
        const data = await api.getDatasetInfo(region.id, datasetId);
        
        const latestDate = data.dates[0];
        if (!latestDate) {
          throw new Error('No data available');
        }

        setLayerData({
          image: api.getImageUrl(latestDate.paths.image),
          geojson: api.getGeoJsonUrl(latestDate.paths.geojson),
          loading: false
        });

      } catch (error) {
        console.error('Error loading layer data:', error);
        setLayerData({
          loading: false,
          error: 'Failed to load layer data'
        });
      }
    };

    fetchLayerData();
  }, [region, datasetId, visible]);

  return layerData;
};
