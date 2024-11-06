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
        ? `${temperature.toFixed(1)}°F`
        : 'N/A';

    return (
        <div
            className="flex flex-col justify-center items-start gap-1 w-20"
            role="status"
            aria-live="polite"
            aria-label={temperature !== null
                ? `Water temperature: ${temperature.toFixed(1)} degrees Celsius`
                : 'Temperature not available'}
        >
            <span className="opacity-50 text-xs font-medium font-mono uppercase text-white">
                Water temp
            </span>
            <span className="text-xl font-semibold text-white">
                {displayValue}
            </span>
        </div>
    );
}; 