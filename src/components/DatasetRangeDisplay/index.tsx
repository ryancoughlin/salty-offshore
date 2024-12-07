import { Dataset } from '../../types/api';
import { getDatasetConfig, getDatasetType } from '../../types/datasets';
import { useMemo } from 'react';
import useMapStore from '../../store/useMapStore';
import { useDatasetValue } from '../../hooks/useDatasetValue';
import type { Map } from 'mapbox-gl';
import {
  getNormalizedValue,
  formatDatasetValue,
  calculateGradientStops
} from '../../utils/datasetFormatting';

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
  const datasetType = useMemo(() => getDatasetType(datasetKey.id), [datasetKey.id]);
  const { cursorPosition, mapRef } = useMapStore();

  const currentValue = useDatasetValue(
    cursorPosition,
    mapRef as Map | null,
    config?.valueKey || 'temperature'
  );

  const gradientStops = useMemo(() => {
    if (!config?.colorScale || !ranges?.[config?.rangeKey]) return '';
    const range = ranges[config.rangeKey];

    return calculateGradientStops(
      range.min,
      range.max,
      config.colorScale,
      datasetType
    );
  }, [config?.colorScale, ranges, config?.rangeKey, datasetType]);

  const normalizedValue = useMemo(() => {
    if (!config || !ranges) return null;
    const range = ranges[config.rangeKey];
    if (!range || currentValue === null) return null;
    return getNormalizedValue(currentValue, range.min, range.max, datasetType);
  }, [currentValue, config, ranges, datasetType]);

  const currentColor = useMemo(() => {
    if (!config?.colorScale || normalizedValue === null) return 'white';
    const colors = Array.isArray(config.colorScale) ? config.colorScale : [];
    const colorIndex = Math.floor(normalizedValue * (colors.length - 1));
    return colors[colorIndex] || colors[0] || 'white';
  }, [config?.colorScale, normalizedValue]);

  if (!config || !ranges) return null;

  const range = ranges[config.rangeKey];
  if (!range) return null;

  const positionPercent = normalizedValue !== null
    ? Math.max(0, Math.min(100, normalizedValue * 100))
    : null;

  return (
    <div className="relative h-6 w-full px-1">
      <div
        className="h-1.5 w-full rounded-sm"
        style={{
          background: `linear-gradient(to right, ${gradientStops})`
        }}
      >
        {positionPercent !== null && (
          <div
            className="absolute -top-0.5 w-4 h-2.5 rounded-sm border border-white shadow-sm transition-all duration-100 ease-out"
            style={{
              left: `${positionPercent}%`,
              transform: 'translateX(-50%)',
              backgroundColor: currentColor
            }}
          />
        )}
      </div>

      <div className="absolute w-full flex justify-between mt-1 px-1">
        <span className="text-xs font-mono text-neutral-400">
          {formatDatasetValue(range.min, datasetType, config.unit)}
        </span>
        <span className="text-xs font-mono text-neutral-400">
          {formatDatasetValue(range.max, datasetType, config.unit)}
        </span>
      </div>
    </div>
  );
}; 