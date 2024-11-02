import React from 'react';
import type { Dataset } from '../types/api';
import { MapIcon } from '@heroicons/react/24/outline';

interface LayerControlProps {
  isSelected: boolean;
  onSelect: (datasetId: string) => void;
  dataset: Dataset;
}

const LayerControl: React.FC<LayerControlProps> = ({
  dataset,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(dataset.id)}
      className={`
        w-24 h-24 p-2 rounded-lg
        flex flex-col items-center justify-center
        text-sm transition-all
        hover:scale-105
        ${isSelected
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
        }
      `}
      aria-label={`Select ${dataset.name} layer`}
      aria-pressed={isSelected}
    >
      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-2">
        <MapIcon className="w-6 h-6" />
      </div>
      <span className="text-center font-medium">
        {dataset.name}
      </span>
    </button>
  );
};

export default LayerControl;
