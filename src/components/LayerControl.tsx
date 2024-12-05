import React from 'react';
import type { Dataset } from '../types/api';
import { getDatasetDisplayName } from '../config';
import type { DatasetConfig } from '../types/datasets';
import { isDatasetLayer, isGlobalLayer } from '../types/core';
import { useLayerStore } from '../store/useLayerStore';
import DatasetInfo from './DatasetInfo/DatasetInfo';
import Toggle from './ui/Toggle';

interface LayerControlProps {
  isSelected: boolean;
  onSelect: (datasetId: string) => void;
  dataset: Dataset;
  config?: DatasetConfig;
}

interface LayerSettingsProps {
  layerId: string;
  settings: {
    visible: boolean;
  };
  onToggle: () => void;
}

const LayerSettings: React.FC<LayerSettingsProps> = ({
  layerId,
  settings,
  onToggle,
}) => (
  <div className="flex items-center justify-between">
    <label className="text-sm text-white">
      {layerId.charAt(0).toUpperCase() + layerId.slice(1)}
    </label>
    <Toggle
      checked={settings.visible}
      onChange={onToggle}
      aria-label={`Toggle ${layerId}`}
    />
  </div>
);

export const LayerControl: React.FC<LayerControlProps> = ({
  dataset,
  isSelected,
  onSelect,
  config
}) => {
  const displayName = getDatasetDisplayName(dataset.id);
  const { layerSettings, toggleLayer } = useLayerStore();

  // Get available layers from config or use defaults
  const availableLayers = config?.supportedLayers || [];
  const datasetLayers = availableLayers.filter(isDatasetLayer);
  const globalLayers = availableLayers.filter(isGlobalLayer);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => onSelect(dataset.id)}
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
      </button>

      {isSelected && (
        <div className="bg-neutral-900 border-b border-white/10">
          <DatasetInfo dataset={dataset} isSelected={isSelected} />

          {/* Layer Controls */}
          {(datasetLayers.length > 0 || globalLayers.length > 0) && (
            <div className="p-4 space-y-4">
              {/* Dataset-specific layers */}
              {datasetLayers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-white/60 mb-2">Layer Options</div>
                  {datasetLayers.map(layerId => {
                    const settings = layerSettings.get(layerId);
                    if (!settings) return null;

                    return (
                      <LayerSettings
                        key={layerId}
                        layerId={layerId}
                        settings={{ visible: settings.visible }}
                        onToggle={() => toggleLayer(layerId)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Global layers */}
              {globalLayers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-white/60 mb-2">Additional Options</div>
                  {globalLayers.map(layerId => {
                    const settings = layerSettings.get(layerId);
                    if (!settings) return null;

                    return (
                      <LayerSettings
                        key={layerId}
                        layerId={layerId}
                        settings={{ visible: settings.visible }}
                        onToggle={() => toggleLayer(layerId)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
