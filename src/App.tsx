import './App.css'
import React, { useState } from 'react'
import SaltyMap from './components/Map/Map'
import RegionPicker from './components/RegionPicker'
import LayerControls from './components/LayerControls'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import type { RegionInfo } from './types/api'
import type { DatasetId } from './types/Layer'

const App: React.FC = () => {
  const { regions, loading: regionsLoading } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Set<DatasetId>>(new Set());

  const handleRegionSelect = (region: RegionInfo) => {
    setSelectedRegion(region);
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

  const regionData = getRegionData(selectedRegion?.id);

  return (
    <div className="w-screen h-screen">
      <SaltyMap
        bounds={selectedRegion?.bounds}
        datasets={regionData?.datasets || []}
        visibleLayers={visibleLayers}
      />
      <RegionPicker
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
      />
      {regionData && (
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
