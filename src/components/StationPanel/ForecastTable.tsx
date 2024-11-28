import { useState } from 'react';
import DirectionArrow from './DirectionArrow';

interface ForecastPeriod {
  time: string;
  waveHeight: string | number;
  wavePeriod: number;
  waveDirection: number;
  windSpeed: string;
  windDirection: number;
  source?: string;
}

interface DaySummary {
  waveHeight: {
    min: number;
    max: number;
    avg: number;
  };
  wavePeriod: {
    min: number;
    max: number;
    avg: number;
  };
  windSpeed: {
    min: number;
    max: number;
    avg: number;
  };
}

interface ForecastDay {
  date: string;
  summary: DaySummary;
  periods: ForecastPeriod[];
}

interface ForecastTableProps {
  forecast: ForecastDay[];
  units: {
    waveHeight: string;
    wavePeriod: string;
    windSpeed: string;
  };
}

const ForecastTable: React.FC<ForecastTableProps> = ({ forecast, units }) => {
  const [selectedDay, setSelectedDay] = useState<string>(forecast[0]?.date);
  const selectedDayData = forecast.find(day => day.date === selectedDay);

  if (!forecast?.length) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
        {forecast.map(day => {
          const { day: dayName, date } = formatDate(day.date);
          return (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day.date)}
              className={`
                flex-none px-3 py-2 rounded text-sm font-medium
                ${selectedDay === day.date 
                  ? 'bg-white/10 text-white' 
                  : 'text-neutral-400 hover:bg-white/5'
                }
              `}
            >
              <div className="text-xs opacity-75">{dayName}</div>
              <div className="font-medium">{date}</div>
              <div className="text-xs mt-1 space-x-2">
                <span>{day.summary.waveHeight.max}'{units.waveHeight}</span>
                <span className="text-neutral-500">|</span>
                <span>{day.summary.windSpeed.max}{units.windSpeed}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedDayData && (
        <div className="bg-neutral-900 rounded-lg border border-white/10">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            <div className="p-3 text-center">
              <div className="text-xs text-neutral-400 uppercase tracking-wide">Waves</div>
              <div className="text-lg font-medium mt-1">
                {selectedDayData.summary.waveHeight.min}-{selectedDayData.summary.waveHeight.max}'
              </div>
              <div className="text-xs text-neutral-500">avg {selectedDayData.summary.waveHeight.avg}'</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs text-neutral-400 uppercase tracking-wide">Period</div>
              <div className="text-lg font-medium mt-1">
                {selectedDayData.summary.wavePeriod.avg}s
              </div>
              <div className="text-xs text-neutral-500">
                {selectedDayData.summary.wavePeriod.min}-{selectedDayData.summary.wavePeriod.max}s
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs text-neutral-400 uppercase tracking-wide">Wind</div>
              <div className="text-lg font-medium mt-1">
                {selectedDayData.summary.windSpeed.min}-{selectedDayData.summary.windSpeed.max}
              </div>
              <div className="text-xs text-neutral-500">avg {selectedDayData.summary.windSpeed.avg}mph</div>
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="divide-y divide-white/5">
              {selectedDayData.periods.map((period, index) => (
                <div key={index} className="p-3 flex items-center justify-between hover:bg-white/5">
                  <div className="w-16">
                    <div className="text-sm font-medium">
                      {new Date(period.time).toLocaleTimeString([], { 
                        hour: 'numeric',
                        hour12: true 
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">{period.waveHeight}'</div>
                    <DirectionArrow 
                      degrees={period.waveDirection} 
                      size="sm"
                      className="text-neutral-400"
                    />
                    <div className="text-xs text-neutral-500">{period.wavePeriod}s</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">{period.windSpeed}mph</div>
                    <DirectionArrow 
                      degrees={period.windDirection}
                      size="sm"
                      className="text-neutral-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastTable; 