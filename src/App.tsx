import { useState } from 'react'
import './App.css'
import MapComponent from './components/Map'
import LayerControls from './components/LayerControls'
import CurrentsLayer from './components/CurrentsLayer'
import type { LayerState } from './types/map.types'

function App() {
  const [layers, setLayers] = useState<LayerState[]>([
    { id: 'currents', visible: true, opacity: 0.8 }
  ])

  const handleLayerChange = (layerId: string, changes: Partial<LayerState>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...changes } : layer
    ))
  }

  const currentLayer = layers.find(l => l.id === 'currents')

  return (
    <>
      <MapComponent>
        {currentLayer && (
          <CurrentsLayer 
            visible={currentLayer.visible} 
            opacity={currentLayer.opacity} 
          />
        )}
      </MapComponent>
      <LayerControls 
        layers={layers} 
        onLayerChange={handleLayerChange} 
      />
    </>
  )
}

export default App
