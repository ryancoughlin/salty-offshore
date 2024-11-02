import React, { useEffect, useCallback } from 'react';
import type { RegionInfo } from '../types/api';
import usePersistedState from '../hooks/usePersistedState';

interface RegionPickerProps {
  regions: RegionInfo[];
  selectedRegion: RegionInfo | null;
  onRegionSelect: (region: RegionInfo) => void;
}

const RegionPicker: React.FC<RegionPickerProps> = ({
  regions,
  selectedRegion,
  onRegionSelect
}) => {
  const [persistedRegionId, setPersistedRegionId] = usePersistedState<string>('selectedRegionId', '');

  useEffect(() => {
    if (persistedRegionId && !selectedRegion) {
      const region = regions.find(r => r.id === persistedRegionId);
      if (region) onRegionSelect(region);
    }
  }, [persistedRegionId, regions, selectedRegion, onRegionSelect]);

  const handleRegionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = regions.find(r => r.id === e.target.value);
    if (region) {
      setPersistedRegionId(region.id);
      onRegionSelect(region);
    }
  }, [regions, setPersistedRegionId, onRegionSelect]);

  return (
    <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-6 border-t-0 border-r border-b-0 border-l-0 border-white/20">
      <select
        value={selectedRegion?.id || ''}
        onChange={handleRegionChange}
        className="block w-64 px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select fishing region"
      >
        <option value="">Select a fishing region...</option>
        {regions.map(region => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionPicker;
