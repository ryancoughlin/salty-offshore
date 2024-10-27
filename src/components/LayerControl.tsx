import React from 'react';
import type { DatasetId } from '../types/Layer';

interface LayerControlProps {
  id: DatasetId;
  name: string;
  visible: boolean;
  onToggle: (datasetId: DatasetId) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({
  id,
  name,
  visible,
  onToggle,
}) => {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`
        w-full px-3 py-1.5 rounded
        flex items-center justify-between
        text-sm transition-colors
        ${visible 
          ? 'bg-blue-500 text-white' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
        }
      `}
    >
      {name}
      <span className="ml-2 text-xs opacity-75">
        {visible ? 'ON' : 'OFF'}
      </span>
    </button>
  );
};

export default LayerControl;
