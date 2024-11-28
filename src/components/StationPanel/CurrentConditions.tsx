import { ArrowUpIcon } from '@heroicons/react/24/outline';
import DirectionArrow from './DirectionArrow';

interface CurrentConditionsProps {
  conditions: {
    time: string;
    waveHeight: number;
    dominantWavePeriod: number;
    meanWaveDirection: number;
    windSpeed: number | null;
    windDirection: number | null;
    waterTemp: number;
  };
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({ conditions }) => {
  return (
    <div className="bg-neutral-900 rounded-lg border border-white/10">
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Waves</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-400">Height</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-medium">{conditions.waveHeight}ft</p>
                <DirectionArrow 
                  degrees={conditions.meanWaveDirection} 
                  size="sm"
                  className="text-neutral-400"
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Period</p>
              <p className="text-2xl font-medium">{conditions.dominantWavePeriod}s</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <ArrowUpIcon className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Wind & Temp</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-400">Speed</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-medium">
                  {conditions.windSpeed ? `${conditions.windSpeed}mph` : 'N/A'}
                </p>
                {conditions.windDirection && (
                  <DirectionArrow 
                    degrees={conditions.windDirection} 
                    size="sm"
                    className="text-neutral-400"
                  />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Water</p>
              <p className="text-2xl font-medium">{conditions.waterTemp}°C</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-white/10">
        <p className="text-xs text-neutral-500">
          Last updated: {new Date(conditions.time).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CurrentConditions; 