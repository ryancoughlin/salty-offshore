import React from 'react';
import { DataLayer } from '../types';

interface LayerToggleProps {
  layers: DataLayer[];
  onToggle: (layerId: string) => void;
}

const LayerToggle: React.FC<LayerToggleProps> = ({ layers, onToggle }) => {
  return (
    <div className="space-y-2">
      {layers.map(layer => (
        <label 
          key={layer.id}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={layer.visible}
            onChange={() => onToggle(layer.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{layer.name}</span>
        </label>
      ))}
    </div>
  );
};

export default LayerToggle;
