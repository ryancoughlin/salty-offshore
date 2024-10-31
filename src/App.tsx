import './App.css'
import React, { useState, useEffect } from 'react'
import SaltyMap from './components/Map/Map'
import RegionPicker from './components/RegionPicker'
import LayerControls from './components/LayerControls'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import type { Region } from './types/api'
import type { DatasetId } from './types/Layer'
import ColorGradient from './components/ColorGradient'
import sstColorScale from './utils/sst_color_scale.json'

const App: React.FC = () => {
  const { regions, loading: regionsLoading } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleUpdateDate = (region: Region) => {
    if (!region) return null;

    const regionData = getRegionData(region.id);
    if (!regionData?.datasets.length) return;

    const allDates = regionData.datasets
      .flatMap(dataset => dataset.dates)
      .map(d => d.date);

    if (allDates.length) {
      setSelectedDate(allDates.sort().reverse()[0]);
    }
  };

  useEffect(() => {
    if (!selectedRegion) {
      setSelectedDate(null);
      return;
    }
    handleUpdateDate(selectedRegion);
  }, [selectedRegion, getRegionData]);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setVisibleLayers(new Set()); // Clear visible layers when region changes
  };

  const handleToggleLayer = (datasetId: DatasetId, layerType?: string) => {
    setVisibleLayers(prev => {
      const next = new Set(prev);

      if (layerType) {
        // Toggle additional layer (e.g., contours)
        const layerId = `${datasetId}-${layerType}`;
        if (next.has(layerId)) {
          next.delete(layerId);
        } else {
          // Ensure main layer is visible when adding additional layer
          next.add(datasetId); // Add main image layer if not present
          next.add(layerId);   // Add the additional layer
        }
      } else {
        // Toggle main dataset (image layer)
        if (next.has(datasetId)) {
          // Remove main layer and all its additional layers
          next.delete(datasetId);
          // Find and remove any additional layers for this dataset
          Array.from(next).forEach(id => {
            if (id.startsWith(`${datasetId}-`)) {
              next.delete(id);
            }
          });
        } else {
          next.add(datasetId); // Just add main layer
        }
      }

      return next;
    });
  };

  if (regionsLoading) {
    return <div>Loading...</div>;
  }

  const regionData = selectedRegion && getRegionData(selectedRegion.id);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-gray-900/80 rounded-lg">
        {regionData?.datasets.map(dataset => (
          dataset.category === 'sst' && (
            <ColorGradient
              key={dataset.id}
              min={dataset.colorScale?.[0] || 0}
              max={dataset.colorScale?.[1] || 100}
              colors={sstColorScale.colors}
            />
          )
        ))}
      </div>
      <SaltyMap
        region={regionData || undefined}
        datasets={regionData?.datasets || []}
        visibleLayers={visibleLayers}
        selectedDate={selectedDate || ''}
      />
      <RegionPicker
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
      />
      {regionData && selectedDate && (
        <LayerControls
          region={regionData}
          onToggleLayer={handleToggleLayer}
          visibleLayers={visibleLayers}
        />
      )}
    </div>
  );
};

export default App;
