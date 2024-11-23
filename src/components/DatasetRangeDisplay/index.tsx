import { Dataset } from '../../types/api';
import { getDatasetConfig } from '../../types/datasets';
import { useMemo } from 'react';
import useMapStore from '../../store/useMapStore';
import { useDatasetValue } from '../../hooks/useDatasetValue';

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
  
  const currentValue = useDatasetValue(cursorPosition, mapRef, config?.valueKey || '');
  
  if (!config || !ranges) return null;

  const range = ranges[config.rangeKey];
  if (!range) return null;

  const positionPercent = currentValue !== null 
    ? ((currentValue - range.min) / (range.max - range.min)) * 100
    : null;

  const gradient = config.colorScale 
    ? `linear-gradient(to right, ${config.colorScale.join(', ')})`
    : 'linear-gradient(to right, from-indigo-600 via-green-500 to-amber-500)';

  return (
    <div className="relative h-6">
      {/* Gradient Bar */}
      <div 
        className="h-1.5 w-full rounded-sm"
        style={{ background: gradient }}
      >
        {/* Position Indicator */}
        {positionPercent !== null && (
          <div 
            className="absolute top-0 w-0.5 h-3 bg-white transition-all duration-100 ease-out"
            style={{
              left: `${positionPercent}%`,
              transform: 'translateX(-50%)'
            }}
          />
        )}
      </div>

      {/* Min/Max Labels */}
      <div className="absolute w-full flex justify-between mt-1">
        <span className="text-xs font-mono text-neutral-400">
          {config.formatValue(range.min)}
        </span>
        <span className="text-xs font-mono text-neutral-400">
          {config.formatValue(range.max)}
        </span>
      </div>
    </div>
  );
}; 