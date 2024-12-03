import { Dataset } from '../../types/api';
import { getDatasetConfig, DatasetType, getDatasetType } from '../../types/datasets';
import { useMemo } from 'react';
import useMapStore from '../../store/useMapStore';
import { useDatasetValue } from '../../hooks/useDatasetValue';
import type { Map } from 'mapbox-gl';

interface DatasetRangeDisplayProps {
  datasetKey: Dataset;
  ranges: {
    [key: string]: {
      min: number;
      max: number;
      unit?: string;
    };
  } | null;
}

export const DatasetRangeDisplay: React.FC<DatasetRangeDisplayProps> = ({
  datasetKey,
  ranges
}) => {
  const config = useMemo(() => getDatasetConfig(datasetKey.id), [datasetKey.id]);
  const { cursorPosition, mapRef } = useMapStore();

  const currentValue = useDatasetValue(
    cursorPosition,
    mapRef as Map | null,
    config?.valueKey || 'temperature'
  );

  // Early return if required data is missing
  if (!config || !ranges) return null;

  // Get range for current dataset
  const range = ranges[config.rangeKey];
  if (!range) return null;

  const formatValue = (val: number): string => {
    const datasetType = getDatasetType(datasetKey.id);
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

  const positionPercent = currentValue !== null
    ? Math.max(0, Math.min(100, ((currentValue - range.min) / (range.max - range.min)) * 100))
    : null;

  return (
    <div className="relative h-6 w-full px-1">
      {/* Gradient Bar */}
      <div
        className="h-1.5 w-full rounded-sm"
        style={{
          background: config.colorScale
            ? `linear-gradient(to right, ${config.colorScale.join(', ')})`
            : 'linear-gradient(to right, rgb(79, 70, 229), rgb(34, 197, 94), rgb(245, 158, 11))'
        }}
      >
        {/* Position Indicator */}
        {positionPercent !== null && (
          <div
            className="absolute top-0 w-0.5 h-3 bg-white shadow-sm transition-all duration-100 ease-out"
            style={{
              left: `${positionPercent}%`,
              transform: 'translateX(-50%)'
            }}
          />
        )}
      </div>

      {/* Min/Max Labels */}
      <div className="absolute w-full flex justify-between mt-1 px-1">
        <span className="text-xs font-mono text-neutral-400">
          {formatValue(range.min)}
        </span>
        <span className="text-xs font-mono text-neutral-400">
          {formatValue(range.max)}
        </span>
      </div>
    </div>
  );
}; 