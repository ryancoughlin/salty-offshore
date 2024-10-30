import React from 'react';
import type { Dataset } from '../types/api';
import type { DatasetId } from '../types/Layer';

interface LayerControlProps {
  dataset: Dataset;
  visible: boolean;
  visibleLayers: Set<string>;
  onToggle: (datasetId: DatasetId, layerType?: string) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({
  dataset,
  visible,
  visibleLayers,
  onToggle,
}) => {
  // Handle child layer toggle without affecting parent
  const handleChildLayerToggle = (layerType: string) => {
    const layerId = `${dataset.id}-${layerType}`;
    if (!visible) {
      // If parent is not visible, turn it on first
      onToggle(dataset.id); // Turn on parent (image layer)
    }
    // Toggle the child layer
    onToggle(dataset.id, layerType);
  };

  return (
    <div className="mb-4">
      {/* Main dataset toggle button */}
      <button
        onClick={() => onToggle(dataset.id)}
        className={`
          w-24 h-24 p-2 rounded
          flex flex-col items-center justify-center
          text-sm transition-colors
          ${visible
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
          }
        `}
        aria-label={`Toggle ${dataset.name} layer`}
        tabIndex={0}
      >
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5h16M4 12h16M4 19h16"
            />
          </svg>
        </div>
        <span className="text-center">
          {dataset.name}
          <span className="ml-1 text-xs opacity-75">
            {visible ? '(ON)' : '(OFF)'}
          </span>
        </span>
      </button>

      {/* Child layer toggles - show when parent is visible */}
      {visible && dataset.supportedLayers.length > 1 && (
        <div className="mt-2 ml-2 space-y-1">
          {dataset.supportedLayers.map(layerType => {
            if (layerType === 'image') return null; // Skip image as it's controlled by main toggle

            const layerId = `${dataset.id}-${layerType}`;
            const layerVisible = visibleLayers.has(layerId);

            return (
              <button
                key={layerId}
                onClick={() => handleChildLayerToggle(layerType)}
                className={`
                  w-20 h-8 px-2 rounded text-xs
                  flex items-center justify-between
                  transition-colors
                  ${layerVisible
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                aria-label={`Toggle ${layerType} for ${dataset.name}`}
                tabIndex={0}
              >
                <span className="capitalize">{layerType}</span>
                <span className="text-xs opacity-75">
                  {layerVisible ? '(ON)' : '(OFF)'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LayerControl;
