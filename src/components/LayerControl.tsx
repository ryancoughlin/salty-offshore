import React, { useState } from 'react';
import type { Dataset } from '../types/api';
import { getDatasetDisplayName } from '../config';
import DatasetInfo from './DatasetInfo/DatasetInfo';

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
  
  const handleClick = () => {
    onSelect(dataset.id);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleClick}
        className={`
          w-full h-12 px-4
          flex items-center justify-between
          border-b transition-colors duration-500
          ${isSelected 
            ? 'bg-white border-white/10 text-neutral-900' 
            : 'bg-neutral-950 border-white/10 text-zinc-100 hover:bg-neutral-900/80'
          }
        `}
        aria-expanded={isSelected}
        aria-controls={`dataset-info-${dataset.id}`}
      >
        <span className="text-base font-medium font-sans">
          {displayName}
        </span>
        <div className="flex items-center gap-2">
          {dataset.thumbnail && (
            <div className={`w-8 h-8 relative rounded overflow-hidden
              ${isSelected ? '' : 'opacity-50 bg-white'}`}
            >
              <img 
                src={dataset.thumbnail} 
                alt=""
                className="w-12 h-8 object-cover -ml-[14px]"
              />
            </div>
          )}
        </div>
      </button>

      <DatasetInfo dataset={dataset} isSelected={isSelected} />
    </div>
  );
};

export default LayerControl;
