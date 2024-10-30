import './App.css'
import React, { useState, useEffect } from 'react'
import SaltyMap from './components/Map/Map'
import RegionPicker from './components/RegionPicker'
import LayerControls from './components/LayerControls'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import type { Region } from './types/api'
import type { DatasetId } from './types/Layer'

const App: React.FC = () => {
  const { regions, loading: regionsLoading } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Set<DatasetId>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // When region changes, find the most recent date from its datasets
  useEffect(() => {
    if (!selectedRegion) {
      setSelectedDate(null);
      return;
    }

    const regionData = getRegionData(selectedRegion.id);
    if (!regionData?.datasets.length) return;

    // Get all available dates from all datasets
    const allDates = regionData.datasets
      .flatMap(dataset => dataset.dates)
      .map(d => d.date);

    // Set the most recent date
    if (allDates.length) {
      const mostRecentDate = allDates.sort().reverse()[0];
      setSelectedDate(mostRecentDate);
    }
  }, [selectedRegion]);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setVisibleLayers(new Set()); // Clear visible layers when region changes
  };

  const handleToggleLayer = (datasetId: DatasetId) => {
    setVisibleLayers(prev => {
      const next = new Set(prev);
      if (next.has(datasetId)) {
        next.delete(datasetId);
      } else {
        next.add(datasetId);
      }
      return next;
    });
  };

  if (regionsLoading) {
    return <div>Loading...</div>;
  }

  const regionData = selectedRegion && getRegionData(selectedRegion.id);

  return (
    <div className="w-screen h-screen">
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
