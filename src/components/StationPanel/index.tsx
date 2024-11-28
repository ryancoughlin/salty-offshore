import { XMarkIcon, BeakerIcon } from '@heroicons/react/24/outline';
import useBuoyData from '../../hooks/useBuoyData';
import CurrentConditions from './CurrentConditions';
import ForecastTable from './ForecastTable';
import ConditionsSummary from './ConditionsSummary';

interface StationPanelProps {
  station: {
    id: string;
    name: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
    type: string;
    hasRealTimeData: boolean;
    owner: string;
  };
  onClose: () => void;
}

export const StationPanel: React.FC<StationPanelProps> = ({ station, onClose }) => {
  const { data, loading, error } = useBuoyData(station.id);

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-neutral-950 text-white shadow-lg z-50 overflow-y-auto border-l border-white/10">
      <div className="flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium tracking-tight">{station.name}</h2>
              <p className="text-neutral-400 text-sm">Station {station.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
              aria-label="Close panel"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div>
            </div>
          )}

          {error && (
            <div className="m-4 bg-red-950/50 text-red-200 p-4 rounded-lg border border-red-900/50">
              <p>{error}</p>
            </div>
          )}

          {data && (
            <div className="p-4 space-y-6">
              <ConditionsSummary summaries={data.data.summaries} />
              <CurrentConditions conditions={data.data.currentConditions} />
              
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">Forecast</h3>
                  <div className="flex items-center space-x-1 text-neutral-400 text-sm">
                    <BeakerIcon className="w-4 h-4" />
                    <span>NOAA/NWS</span>
                  </div>
                </div>
                {data?.data?.forecast && data?.data?.units && (
                  <ForecastTable 
                    forecast={data.data.forecast} 
                    units={data.data.units}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 