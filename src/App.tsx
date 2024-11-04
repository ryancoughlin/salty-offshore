import './App.css'
import React, { useMemo, useEffect } from 'react'
import SaltyMap from './components/Map/Map'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import LayerControls from './components/LayerControls'
import useMapStore from './store/useMapStore'

const App: React.FC = () => {
  const { regions } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const { selectedRegion, initializeRegionData } = useMapStore();

  const regionData = useMemo(() =>
    selectedRegion ? getRegionData(selectedRegion.id) : null,
    [selectedRegion, getRegionData]
  );

  useEffect(() => {
    if (regionData) {
      initializeRegionData(regionData);
    }
  }, [regionData, initializeRegionData]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <SaltyMap regions={regions} />
      {regionData && <LayerControls region={regionData} />}
    </div>
  );
};

export default App;
