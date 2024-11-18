import { useTemperatureCalculation } from '../../hooks/useTemperatureCalculation';
import type { Dataset } from '../../types/api';
import type { Coordinate } from '../../types/core';

interface WaterTemperatureDisplayProps {
  dataset: Dataset;
  cursorPosition: Coordinate;
  mapRef: mapboxgl.Map | null;
}

export const WaterTemperatureDisplay: React.FC<WaterTemperatureDisplayProps> = ({
  dataset,
  cursorPosition,
  mapRef
}) => {
  const temperature = useTemperatureCalculation(dataset, cursorPosition, mapRef);

  const displayValue = temperature !== null
    ? `${temperature.toFixed(1)}°`
    : 'N/A';

  return (
    <div 
      className="flex-col justify-start items-start gap-2 flex"
      role="status"
      aria-live="polite"
      aria-label={temperature !== null
        ? `Water temperature: ${temperature.toFixed(1)} degrees`
        : 'Temperature not available'}
    >
      <div className="flex-col justify-center items-start gap-2 flex">
        <span className="subtle-heading">
          Water temp
        </span>
        <span className="text-white text-2xl font-medium font-sans">
          {displayValue}
        </span>
      </div>
    </div>
  );
};