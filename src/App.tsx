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

// Create a custom hook for layer management
const useLayerManager = () => {
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set());

  const toggleLayer = (datasetId: DatasetId, layerType?: string) => {
    setVisibleLayers(prev => {
      const next = new Set(prev);
      const layerId = layerType ? `${datasetId}-${layerType}` : datasetId;

      if (next.has(layerId)) {
        next.delete(layerId);
        // Remove related layers if main layer
        if (!layerType) {
          Array.from(next).forEach(id => {
            if (id.startsWith(`${datasetId}-`)) next.delete(id);
          });
        }
      } else {
        next.add(layerId);
        if (layerType) next.add(datasetId); // Ensure main layer is visible
      }

      return next;
    });
  };

  return { visibleLayers, toggleLayer };
};

const App: React.FC = () => {
  const { regions, loading: regionsLoading } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const { visibleLayers, toggleLayer } = useLayerManager();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRegion) {
      setSelectedDate(null);
      return;
    }

    const regionData = getRegionData(selectedRegion.id);
    const allDates = regionData?.datasets
      .flatMap(dataset => dataset.dates)
      .map(d => d.date);

    if (allDates?.length) {
      setSelectedDate(allDates.sort().reverse()[0]);
    }
  }, [selectedRegion, getRegionData]);

  if (regionsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const regionData = selectedRegion && getRegionData(selectedRegion.id);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-gray-900/80 rounded-lg">
        {regionData?.datasets.map(dataset => (
          dataset.category === 'sst' && (
            <ColorGradient
              key={dataset.id}
              min={32}
              max={80}
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
        onRegionSelect={setSelectedRegion}
      />
      {regionData && selectedDate && (
        <LayerControls
          region={regionData}
          onToggleLayer={toggleLayer}
          visibleLayers={visibleLayers}
        />
      )}
    </div>
  );
};

export default App;
