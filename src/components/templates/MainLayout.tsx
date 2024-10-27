import React from 'react';
import Map from '../organisms/Map';
import LayerControls from '../organisms/LayerControls';
import TimelineControl from '../organisms/TimelineControl';
import { MapState } from '../../types';

interface MainLayoutProps {
  mapState: MapState;
  setMapState: React.Dispatch<React.SetStateAction<MapState>>;
}

const MainLayout: React.FC<MainLayoutProps> = ({ mapState, setMapState }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Offshore Fishing Data</h1>
      </header>
      
      <main className="flex-1 flex">
        <aside className="w-80 bg-white shadow-sm p-4">
          <LayerControls mapState={mapState} setMapState={setMapState} />
        </aside>
        
        <div className="flex-1 flex flex-col">
          <Map mapState={mapState} />
          <TimelineControl 
            timeRange={mapState.timeRange}
            onTimeChange={(newTime) => 
              setMapState(prev => ({
                ...prev,
                timeRange: { ...prev.timeRange, current: newTime }
              }))
            }
          />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
