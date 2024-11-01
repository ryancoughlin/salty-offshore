import './App.css'
import React, { useState, useCallback } from 'react'
import SaltyMap from './components/Map/Map'
import RegionPicker from './components/RegionPicker'
import LayerControls from './components/LayerControls'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import { useLayerManager } from './hooks/useLayerManager'
import type { Region } from './types/api'
import ColorGradient from './components/ColorGradient'
import usePersistedState from './hooks/usePersistedState'

const App: React.FC = () => {
  const { regions, loading: regionsLoading } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const [selectedRegion, setSelectedRegion] = usePersistedState<Region | null>('selectedRegion', null);
  const { visibleDatasets, toggleDataset, ensureSSTDataset } = useLayerManager();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleRegionSelect = useCallback((region: Region) => {
    setSelectedRegion(region);
    const regionData = getRegionData(region.id);

    if (regionData) {
      ensureSSTDataset(regionData.datasets);

      const mostRecentDate = regionData.datasets
        .flatMap(dataset => dataset.dates)
        .map(d => d.date)
        .sort()
        .reverse()[0];

      setSelectedDate(mostRecentDate || null);
    }
  }, [getRegionData, setSelectedRegion, ensureSSTDataset]);

  if (regionsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const regionData = selectedRegion ? getRegionData(selectedRegion.id) : null;

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-gray-900/80 rounded-lg">
        {regionData?.datasets
          .filter(dataset => dataset.category === 'sst')
          .map(dataset => (
            <ColorGradient
              key={dataset.id}
              min={32}
              max={80}
            />
          ))}
      </div>
      <SaltyMap
        region={regionData}
        datasets={regionData?.datasets || []}
        visibleDatasets={visibleDatasets}
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
          onToggleDataset={toggleDataset}
          visibleDatasets={visibleDatasets}
        />
      )}
    </div>
  );
};

export default App;
