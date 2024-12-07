import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, useParams, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoginForm } from './components/auth/LoginForm'
import { SignUpForm } from './components/auth/SignUpForm'
import { UserProfile } from './components/auth/UserProfile'
import { Billing } from './components/account/Billing'
import { Boat } from './components/account/Boat'
import SaltyMap from './components/Map/Map'
import Dock from './components/Dock'
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
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginForm />,
  },
  {
    path: ROUTES.AUTH.SIGNUP,
    element: <SignUpForm />,
  },
  {
    path: ROUTES.ACCOUNT.PROFILE,
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ACCOUNT.BILLING,
    element: (
      <ProtectedRoute>
        <Billing />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ACCOUNT.BOAT,
    element: (
      <ProtectedRoute>
        <Boat />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.REGION,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DATASET,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DATE,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
