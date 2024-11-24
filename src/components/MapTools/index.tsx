import React from 'react';
import { useMapToolsStore } from '../../store/mapToolsStore';
import { DistanceTool } from './DistanceTool';

export const MapTools: React.FC = () => {
  const { 
    activateDistanceTool,
    deactivateTools, 
    isToolActive, 
    activeTool,
    currentPath,
    paths,
    completePath,
    clearPaths,
  } = useMapToolsStore();

  const handleToggleMeasure = () => {
    if (isToolActive) {
      deactivateTools();
    } else {
      activateDistanceTool();
    }
  };

  return (
    <>
      <div className="absolute top-4 right-16 z-10 flex gap-2">
        {/* Measure Tool Toggle */}
        <button
          onClick={handleToggleMeasure}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isToolActive && activeTool === 'distance' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white/10 text-white/90 hover:bg-white/20'
            }`}
          aria-label="Toggle measure tool"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>Measure</span>
          </div>
        </button>

        {/* Active Measurement Controls */}
        {isToolActive && currentPath && (
          <>
            <button
              onClick={completePath}
              className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
              aria-label="Complete current measurement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Done</span>
            </button>
            <button
              onClick={deactivateTools}
              className="px-3 py-2 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
              aria-label="Cancel measurement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          </>
        )}

        {/* Clear All (only show when there are completed paths) */}
        {paths.length > 0 && (
          <button
            onClick={clearPaths}
            className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
            aria-label="Clear all measurements"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All</span>
          </button>
        )}
      </div>
      <DistanceTool />
    </>
  );
}; 