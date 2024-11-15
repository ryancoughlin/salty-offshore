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
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-neutral-950">
      <div className="px-6">
        <CurrentStatusBar
          regions={regions}
          selectedRegion={selectedRegion}
          onRegionSelect={selectRegion}
          cursorPosition={cursorPosition}
          mapRef={mapRef}
          dataset={selectedDataset}
        />
      </div>
      <div className="flex-1 min-h-0 px-6">
        <div className="flex h-full">
          <SaltyMap regions={regions} />
          {regionData && <LayerControls region={regionData} />}
        </div>
      </div>
      <div className="px-6">
        {selectedRegion && selectedDataset && (
          <DateTimeline
            dataset={selectedDataset}
            selectedDate={selectedDate}
            onDateSelect={selectDate}
          />
        )}
      </div>
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
