import React from 'react';
import type { Dataset } from '../types/api';
import { MapIcon } from '@heroicons/react/24/outline';
import { getDatasetDisplayName } from '../config';

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
  const displayName = getDatasetDisplayName(dataset.id);
  
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
      aria-label={`Select ${displayName} layer`}
      aria-pressed={isSelected}
    >
      <span className="text-center font-medium">
        {displayName}
      </span>
    </button>
  );
};

export default LayerControl;
