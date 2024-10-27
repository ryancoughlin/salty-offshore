import React from 'react'
import './App.css'
import Map from './components/Map'
import LayerToggle from './components/LayerToggle'
import { MapState } from './types'

const App: React.FC = () => {
  const [mapState, setMapState] = React.useState<MapState>({
    layers: [
      { id: 'sst', name: 'Sea Surface Temperature', visible: true },
    ],
  });

  const handleLayerToggle = (layerId: string) => {
    setMapState(prev => ({
      ...prev,
      layers: prev.layers.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    }));
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Offshore Fishing Data</h1>
      </header>
      
      <main className="flex-1 flex">
        <aside className="w-64 bg-white p-4">
          <LayerToggle 
            layers={mapState.layers}
            onToggle={handleLayerToggle}
          />
        </aside>
        <Map layers={mapState.layers} />
      </main>
    </div>
  );
};

export default App
