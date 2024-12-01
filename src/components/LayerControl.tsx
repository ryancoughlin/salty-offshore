import React from 'react';
import type { Dataset } from '../types/api';
import { getDatasetDisplayName } from '../config';
import { getDatasetConfig } from '../types/datasets';
import { isDatasetLayer, isGlobalLayer } from '../types/core';
import { useLayerStore } from '../store/useLayerStore';
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
  const { layerSettings, toggleLayer, setLayerOpacity } = useLayerStore();

  const handleClick = () => {
    onSelect(dataset.id);
  };

  // Get available layers for this dataset
  const config = getDatasetConfig(dataset.id);
  const availableLayers = config?.supportedLayers || [];
  const datasetLayers = availableLayers.filter(isDatasetLayer);
  const globalLayers = availableLayers.filter(isGlobalLayer);

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
                      <div key={layerId} className="flex items-center justify-between">
                        <label className="text-sm text-white">
                          {layerId.charAt(0).toUpperCase() + layerId.slice(1)}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settings.visible}
                            onChange={() => toggleLayer(layerId)}
                            className="rounded border-white/20"
                          />
                          {settings.visible && (
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.opacity}
                                onChange={(e) => setLayerOpacity(layerId, parseFloat(e.target.value))}
                                className="w-24"
                              />
                              <span className="text-xs text-white/60 w-8">
                                {Math.round(settings.opacity * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
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
                      <div key={layerId} className="flex items-center justify-between">
                        <label className="text-sm text-white">
                          {layerId.charAt(0).toUpperCase() + layerId.slice(1)}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settings.visible}
                            onChange={() => toggleLayer(layerId)}
                            className="rounded border-white/20"
                          />
                          {settings.visible && (
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.opacity}
                                onChange={(e) => setLayerOpacity(layerId, parseFloat(e.target.value))}
                                className="w-24"
                              />
                              <span className="text-xs text-white/60 w-8">
                                {Math.round(settings.opacity * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
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

export default LayerControl;
