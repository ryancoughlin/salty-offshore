import { Dataset } from '../../types/api';

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
  if (!ranges) return null;

  const rangeKey = Object.keys(ranges)[0];
  const range = ranges[rangeKey];

  return (
    <div className="flex-col justify-start items-start gap-1 flex">
      <div className="flex justify-between items-center w-full">
        <span className="text-xs text-white/60">Range</span>
        <div className="flex gap-2">
          <span className="text-xs text-white/60">
            {range.min.toFixed(1)}° - {range.max.toFixed(1)}°
          </span>
        </div>
      </div>
    </div>
  );
}; 