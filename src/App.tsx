import './App.css'
import React, { useMemo, useEffect } from 'react'
import SaltyMap from './components/Map/Map'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import LayerControls from './components/LayerControls'
import { DateTimeline } from './components/DateTimeline'
import { CurrentStatusBar } from './components/CurrentStatusBar'
import useMapStore from './store/useMapStore'

const App: React.FC = () => {
  const { regions } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const {
    selectedRegion,
    selectedDataset,
    selectedDate,
    selectDefaultDataset,
    selectDate,
    selectRegion,
    cursorPosition,
    mapRef
  } = useMapStore();

  const regionData = useMemo(() =>
    selectedRegion ? getRegionData(selectedRegion.id) : null,
    [selectedRegion, getRegionData]
  );

  useEffect(() => {
    if (regionData) {
      selectDefaultDataset(regionData);
    }
  }, [regionData, selectDefaultDataset]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden p-6 pt-0 pb-0 bg-neutral-950">
      <CurrentStatusBar
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={selectRegion}
        cursorPosition={cursorPosition}
        mapRef={mapRef}
        dataset={selectedDataset}
      />
      <SaltyMap regions={regions} />
      {regionData && <LayerControls region={regionData} />}
      {selectedRegion && selectedDataset && (
        <DateTimeline
          dataset={selectedDataset}
          selectedDate={selectedDate}
          onDateSelect={selectDate}
        />
      )}
    </div>
  );
};

export default App;
