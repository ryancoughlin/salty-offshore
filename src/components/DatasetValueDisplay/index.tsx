import { useDatasetValue } from '../../hooks/useDatasetValue';
import { getDatasetConfig, DatasetType, getDatasetType } from '../../types/datasets';
import type { Coordinate } from '../../types/core';
import type { Dataset } from '../../types/api';
import { useMemo } from 'react';

interface DatasetValueDisplayProps {
  dataset: Dataset;
  cursorPosition: Coordinate;
  mapRef: mapboxgl.Map | null;
}

export const DatasetValueDisplay: React.FC<DatasetValueDisplayProps> = ({
  dataset,
  cursorPosition,
  mapRef
}) => {
  const config = useMemo(() => getDatasetConfig(dataset.id), [dataset.id]);
  const value = useDatasetValue(cursorPosition, mapRef, config?.valueKey || 'temperature');
  
  if (!config) {
    console.warn(`No configuration found for dataset: ${dataset.id}`);
    return null;
  }

  const formatValue = (val: number): string => {
    const datasetType = getDatasetType(dataset.id);
    switch (datasetType) {
      case DatasetType.BLENDED_SST:
      case DatasetType.LEO_SST:
        return `${val.toFixed(1)}${config.unit}`;
      case DatasetType.CHLOROPHYLL:
        return `${val.toFixed(2)} ${config.unit}`;
      case DatasetType.WAVE_HEIGHT:
        return `${val.toFixed(1)}${config.unit}`;
      case DatasetType.CURRENTS:
        return `${val.toFixed(2)}${config.unit}`;
      default:
        return `${val}${config.unit}`;
    }
  };

  const displayValue = value !== null ? formatValue(value) : 'N/A';
  const isAvailable = value !== null;

  return (
    <div 
      className="flex-col justify-start items-start gap-2 flex"
      role="status"
      aria-live="polite"
      aria-label={isAvailable
        ? `${config.label}: ${displayValue}`
        : `${config.label} not available`}
    >
      <div className="flex-col justify-center items-start gap-2 flex">
        <span className="subtle-heading">
          {config.label}
        </span>
        <span 
          className="text-2xl font-normal font-mono text-white"
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}; 