import { useDatasetCalculation } from '../../hooks/useDatasetCalculation';
import { DATASET_CONFIGS } from '../../types/datasets';
import type { Coordinate } from '../../types/core';

interface DatasetDisplayProps {
  datasetKey: string;
  cursorPosition: Coordinate;
  mapRef: mapboxgl.Map | null;
}

export const DatasetDisplay: React.FC<DatasetDisplayProps> = ({
  datasetKey,
  cursorPosition,
  mapRef
}) => {
  const value = useDatasetCalculation(datasetKey, cursorPosition, mapRef);
  const config = DATASET_CONFIGS[datasetKey];

  const displayValue = value !== null
    ? config.formatValue(value)
    : 'N/A';

  return (
    <div 
      className="flex-col justify-start items-start gap-2 flex"
      role="status"
      aria-live="polite"
      aria-label={value !== null
        ? `${config.displayName}: ${displayValue}`
        : `${config.displayName} not available`}
    >
      <div className="flex-col justify-center items-start gap-2 flex">
        <span className="subtle-heading">
          {config.displayName}
        </span>
        <span className="text-white text-2xl font-medium font-sans">
          {displayValue}
        </span>
      </div>
    </div>
  );
}; 