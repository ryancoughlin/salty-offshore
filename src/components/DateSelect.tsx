import { Dataset } from '../types/Dataset';
import { useMetadata } from '../hooks/useMetadata';

interface DateSelectProps {
  dataset: Dataset;
  regionId: string;
  onDateChange: (date: string | null) => void;
}

export const DateSelect = ({ dataset, regionId, onDateChange }: DateSelectProps) => {
  const { metadata } = useMetadata(regionId);
  
  if (!metadata || !metadata[dataset.id]) return null;
  
  const dates = metadata[dataset.id].dates.map(d => d.date);

  return (
    <select 
      value={dataset.selectedDate || ''} 
      onChange={(e) => onDateChange(e.target.value || null)}
    >
      <option value="">Select a date</option>
      {dates.map(date => (
        <option key={date} value={date}>
          {new Date(date).toLocaleDateString()}
        </option>
      ))}
    </select>
  );
}; 