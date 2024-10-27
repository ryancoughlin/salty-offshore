import './App.css'
import React, { useState } from 'react'
import Map from './components/Map'
import RegionPicker from './components/RegionPicker'
import LayerControls from './components/LayerControls'
import { AVAILABLE_REGIONS } from './mocks/regions'
import type { Region } from './types/Region'
import type { LayerGroups, DatasetId } from './types/Layer'

const DEFAULT_LAYER_GROUPS: LayerGroups = {
  sst: [
    { 
      id: 'LEOACSPOSSTL3SnrtCDaily',
      category: 'sst',
      name: 'LEO ACSPO SST',
      visible: false 
    }
    // Add other SST datasets here
  ],
  currents: [
    {
      id: 'BLENDEDNRTcurrentsDaily',
      category: 'currents',
      name: 'NOAA Blended Currents',
      visible: false
    }
  ],
  chlorophyll: [
    {
      id: 'chlorophyll_oci',
      category: 'chlorophyll',
      name: 'Chlorophyll OCI',
      visible: false
    }
  ]
};

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [layerGroups, setLayerGroups] = useState<LayerGroups>(DEFAULT_LAYER_GROUPS);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleToggleLayer = (datasetId: DatasetId) => {
    setLayerGroups(prevGroups => {
      const newGroups = { ...prevGroups };
      
      // Find and toggle the layer in the appropriate group
      Object.keys(newGroups).forEach(category => {
        newGroups[category] = newGroups[category].map(layer =>
          layer.id === datasetId 
            ? { ...layer, visible: !layer.visible }
            : layer
        );
      });
      
      return newGroups;
    });
  };

  return (
    <div className="w-screen h-screen">
      <Map 
        selectedRegion={selectedRegion}
        layerGroups={layerGroups}
      />
      <RegionPicker
        regions={AVAILABLE_REGIONS}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
      />
      {selectedRegion && (
        <LayerControls
          layerGroups={layerGroups}
          onToggleLayer={handleToggleLayer}
        />
      )}
    </div>
  );
};

export default App;
