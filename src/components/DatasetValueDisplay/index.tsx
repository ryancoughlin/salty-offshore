import { useDatasetValue } from '../../hooks/useDatasetValue';
import { getDatasetConfig } from '../../types/datasets';
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
  
  if (!config) {
    console.warn(`No configuration found for dataset: ${dataset.id}`);
    return null;
  }

  const value = useDatasetValue(cursorPosition, mapRef, config.valueKey);
  const displayValue = value !== null ? config.formatValue(value) : 'N/A';
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
          className="text-2xl font-medium font-sans text-white"
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}; 