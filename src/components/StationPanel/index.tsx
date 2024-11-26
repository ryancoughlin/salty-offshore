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
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Station Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close panel"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Station ID</h3>
            <p>{station.id}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Name</h3>
            <p>{station.name}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Location</h3>
            <p>
              Lat: {station.location.coordinates[1].toFixed(4)}°<br />
              Lon: {station.location.coordinates[0].toFixed(4)}°
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Type</h3>
            <p className="capitalize">{station.type}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Owner</h3>
            <p>{station.owner}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Status</h3>
            <p className={station.hasRealTimeData ? 'text-green-600' : 'text-red-600'}>
              {station.hasRealTimeData ? 'Active' : 'Inactive'}
            </p>
          </div>

          {/* Placeholder for future forecast data */}
          <div className="mt-8">
            <h3 className="font-medium text-gray-700 mb-2">Forecast</h3>
            <p className="text-gray-500 italic">
              Forecast data will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 