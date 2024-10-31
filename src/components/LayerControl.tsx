import React from 'react';
import type { Dataset } from '../types/api';
import type { DatasetId } from '../types/Layer';
import { isAdditionalLayer } from '../types/core';
import { MapIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

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

  const additionalLayers = dataset.supportedLayers
    ? dataset.supportedLayers.filter(layer => {
      const isAdditional = isAdditionalLayer(layer);
      return isAdditional;
    })
    : [];

  return (
    <div className="mb-4">
      {/* Main dataset toggle button */}
      <button
        onClick={() => onToggle(dataset.id)}
        className={`
          w-24 h-24 p-2 rounded-lg
          flex flex-col items-center justify-center
          text-sm transition-all
          hover:scale-105
          ${visible
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
          }
        `}
        aria-label={`Toggle ${dataset.name} layer`}
      >
        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-2">
          <MapIcon className="w-6 h-6" />
        </div>
        <span className="text-center font-medium">
          {dataset.name}
          <span className="ml-1 text-xs opacity-75">
            {visible ? '(ON)' : '(OFF)'}
          </span>
        </span>
      </button>

      {/* Additional layer toggles */}
      {visible && additionalLayers.length > 0 && (
        <div className="mt-2 ml-2 space-y-1">
          {additionalLayers.map(layerType => {
            const layerId = `${dataset.id}-${layerType}`;
            const layerVisible = visibleLayers.has(layerId);

            return (
              <button
                key={layerId}
                onClick={() => onToggle(dataset.id, layerType)}
                className={`
                  w-20 h-8 px-2 rounded-md
                  flex items-center justify-between
                  transition-all
                  hover:scale-105
                  ${layerVisible
                    ? 'bg-blue-400 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }
                `}
                aria-label={`Toggle ${layerType} for ${dataset.name}`}
              >
                <Squares2X2Icon className="w-4 h-4" />
                <span className="text-xs font-medium capitalize">
                  {layerType}
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
