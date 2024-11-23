import { Dataset } from '../../types/api';
import { getDatasetConfig } from '../../types/datasets';
import { useMemo } from 'react';

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

  console.log(config, ranges);
  
  if (!config || !ranges) return null;

  const range = ranges[config.rangeKey];
  if (!range) return null;

  return (
    <div className="flex-col justify-start items-start gap-1 flex">
      <div className="flex justify-between items-center w-full">
        <span className="text-xs text-white/60">Range</span>
        <div className="flex gap-2">
          <span className="text-xs text-white/60">
            {config.formatRange(range.min, range.max)}
          </span>
        </div>
      </div>
    </div>
  );
}; 