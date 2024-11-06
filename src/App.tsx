import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SaltyMap from './components/Map/Map'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import LayerControls from './components/LayerControls'
import { DateTimeline } from './components/DateTimeline'
import { CurrentStatusBar } from './components/CurrentStatusBar'
import useMapStore from './store/useMapStore'
import { useUrlSync } from './hooks/useUrlSync'
import { ROUTES } from './routes'
import { usePrefetchRegionData } from './hooks/usePrefetchRegionData'

const AppContainer: React.FC = () => {
  const { regions } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const {
    selectedRegion,
    selectedDataset,
    selectedDate,
    selectRegion,
    selectDate,
    cursorPosition,
    mapRef
  } = useMapStore();

  useUrlSync();
  usePrefetchRegionData(selectedRegion);

  const regionData = selectedRegion ? getRegionData(selectedRegion.id) : null;

  return (
    <div className="flex justify-between flex-col w-screen h-screen overflow-hidden p-6 pt-0 pb-0 bg-neutral-950">
      <CurrentStatusBar
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={selectRegion}
        cursorPosition={cursorPosition}
        mapRef={mapRef}
        dataset={selectedDataset}
      />
      <div className="flex-row flex h-full">
        <SaltyMap regions={regions} />
        {regionData && <LayerControls region={regionData} />}
      </div>
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

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path={ROUTES.HOME} element={<AppContainer />}>
        <Route path={ROUTES.REGION} element={<AppContainer />} />
        <Route path={ROUTES.DATASET} element={<AppContainer />} />
        <Route path={ROUTES.DATE} element={<AppContainer />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
