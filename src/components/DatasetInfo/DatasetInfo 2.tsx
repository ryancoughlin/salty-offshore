import { Dataset } from '../../types/api';
import DatasetInfoRow from './DatasetInfoRow';
import { useMemo } from 'react';

interface DatasetInfoProps {
  dataset: Dataset;
  isSelected: boolean;
}

const DatasetInfo: React.FC<DatasetInfoProps> = ({ dataset, isSelected }) => {
  const metadataEntries = useMemo(() => {
    if (!dataset.metadata) return [];
    
    return Object.entries(dataset.metadata)
      .filter(([_, value]) => value) // Filter out undefined/empty values
      .map(([key, value]) => ({
        label: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: value as string
      }));
  }, [dataset.metadata]);

  return (
    <div
      id={`dataset-info-${dataset.id}`}
      className={`
        overflow-hidden transition-all duration-400 ease-in-out
        ${isSelected ? 'max-h-96' : 'max-h-0'}
      `}
    >
      <div className="bg-white/90 border-b border-white/10 p-4">
        <div className="space-y-2">
          {metadataEntries.map(({ label, value }) => (
            <DatasetInfoRow
              key={label}
              label={label}
              value={value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatasetInfo; 