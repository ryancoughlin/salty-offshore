import React from 'react';
import type { Dataset } from '../types/api';
import { MapIcon } from '@heroicons/react/24/outline';

interface LayerControlProps {
  dataset: Dataset;
  visible: boolean;
  onToggle: (datasetId: string) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({
  dataset,
  visible,
  onToggle,
}) => {
  return (
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
  );
};

export default LayerControl;
