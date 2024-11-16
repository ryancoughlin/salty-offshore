import './App.css'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
import Dock from './components/Dock'
import AppBar from './AppBar';
import RegionContent from './RegionContent';
import type { Region, RegionInfo } from '../../types/api';

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
    <div className="flex h-screen overflow-hidden bg-neutral-950">
      <Dock
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={selectRegion}
        regionData={regionData}
      />
      <main className="flex-1 relative">
        <SaltyMap regions={regions} />
        {selectedRegion && selectedDataset && (
          <DateTimeline
            dataset={selectedDataset}
            selectedDate={selectedDate}
            onDateSelect={selectDate}
          />
        )}
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppContainer />,
    children: [
      {
        path: ROUTES.REGION,
        element: <AppContainer />
      },
      {
        path: ROUTES.DATASET,
        element: <AppContainer />
      },
      {
        path: ROUTES.DATE,
        element: <AppContainer />
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
