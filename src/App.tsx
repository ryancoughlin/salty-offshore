import './App.css'
import React, { useState, useCallback } from 'react'
import SaltyMap from './components/Map/Map'
import RegionPicker from './components/RegionPicker'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import type { Region } from './types/api'
import ColorGradient from './components/ColorGradient'
import LayerControls from './components/LayerControls'
import type { ISODateString } from './types/api'
import type { Dataset } from './types/api'

const App: React.FC = () => {
  const { regions, loading: regionsLoading } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedDate, setSelectedDate] = useState<ISODateString | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const regionData = selectedRegion ? getRegionData(selectedRegion.id) : null;

  const handleRegionSelect = useCallback((region: Region) => {
    setSelectedRegion(region);
    const regionData = getRegionData(region.id);

    if (regionData) {
      const defaultDataset = regionData.datasets.find(d => d.category === 'sst');
      if (defaultDataset) {
        setSelectedDataset(defaultDataset);
        const mostRecentDate = defaultDataset.dates?.[0]?.date;
        setSelectedDate(mostRecentDate || null);
      }
    }
  }, [getRegionData]);

  const handleDatasetSelect = useCallback((datasetId: string) => {
    const dataset = regionData?.datasets.find(d => d.id === datasetId);
    if (dataset) {
      setSelectedDataset(dataset);
      const mostRecentDate = dataset.dates?.[0]?.date;
      setSelectedDate(mostRecentDate || null);
    }
  }, [regionData]);

  if (regionsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <SaltyMap
        region={selectedRegion}
        datasets={regionData?.datasets || []}
        selectedDataset={selectedDataset}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <RegionPicker
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
      />

      {regionData && (
        <LayerControls
          region={regionData}
          selectedDataset={selectedDataset}
          onDatasetSelect={handleDatasetSelect}
        />
      )}
    </div>
  );
};

export default App;
