import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, useParams, Navigate } from 'react-router-dom'
import SaltyMap from './components/Map/Map'
import Dock from './components/Dock'
import { DateTimeline } from './components/DateTimeline'
import { useRegions } from './hooks/useRegions'
import { useRegionDatasets } from './hooks/useRegionDatasets'
import useMapStore from './store/useMapStore'
import { ROUTES } from './routes'
import { useUrlSync } from './hooks/useUrlSync'

const MainLayout: React.FC = () => {
  const params = useParams();
  const {
    selectedRegion,
    selectedDataset,
    selectedDate,
    selectRegion,
    selectDataset,
    selectDate,
  } = useMapStore();
  const { regions } = useRegions();
  const { getRegionData } = useRegionDatasets();

  // Enable URL sync
  useUrlSync();

  // Handle URL params on mount and updates
  useEffect(() => {
    if (params.regionId && !selectedRegion) {
      const region = regions.find(r => r.id === params.regionId);
      if (region) {
        const fullRegionData = getRegionData(region.id);
        if (fullRegionData) {
          selectRegion(fullRegionData);
        }
      }
    }
    if (params.datasetId && !selectedDataset) {
      const dataset = getRegionData(params.regionId!)?.datasets
        .find(d => d.id === params.datasetId);
      if (dataset) selectDataset(dataset);
    }
    if (params.date && !selectedDate) {
      selectDate(params.date);
    }
  }, [params, regions, selectedRegion, selectedDataset, selectedDate, getRegionData, selectRegion, selectDataset, selectDate]);

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
        <SaltyMap />
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
    element: <MainLayout />,
  },
  {
    path: ROUTES.REGION,
    element: <MainLayout />,
  },
  {
    path: ROUTES.DATASET,
    element: <MainLayout />,
  },
  {
    path: ROUTES.DATE,
    element: <MainLayout />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
