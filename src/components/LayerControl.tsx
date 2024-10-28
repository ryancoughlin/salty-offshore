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
        w-24 h-24 p-2 rounded
        flex flex-col items-center justify-center
        text-sm transition-colors
        ${visible
          ? 'bg-blue-500 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100'
        }
      `}
      aria-label={`Toggle ${name} layer`}
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
        {name}
        <span className="ml-1 text-xs opacity-75">
          {visible ? '(ON)' : '(OFF)'}
        </span>
      </span>
    </button>
  );
};

export default LayerControl;
