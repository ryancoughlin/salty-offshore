import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Region } from '../../types/api';
import usePersistedState from '../../hooks/usePersistedState';
import { RegionSelectItem } from './RegionSelectItem';
import { useRegionDatasets } from '../../hooks/useRegionDatasets';

interface RegionPickerProps {
  regions: Region[];
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
}

export const RegionPicker: React.FC<RegionPickerProps> = ({
  regions,
  selectedRegion,
  onRegionSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getRegionData } = useRegionDatasets();

  const sortedRegions = [...regions].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleRegionSelect = useCallback((region: Region) => {
    const fullRegionData = getRegionData(region.id);
    if (fullRegionData) {
      onRegionSelect(fullRegionData);
    }
    setIsOpen(false);
  }, [onRegionSelect, getRegionData]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={dropdownRef} className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 px-4 border-b border-white/20 flex items-center justify-between cursor-pointer"
      >
        <div className="text-white text-xl font-semibold font-['Spline Sans']">
          {selectedRegion?.name || 'Select Region'}
        </div>
        <ChevronRightIcon 
          className={`w-6 h-6 text-white transform transition-transform duration-150 ${isOpen ? 'rotate-90' : '-rotate-90'}`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 bg-neutral-950 border-b border-white/20 z-50">
          {sortedRegions.map(region => (
            <RegionSelectItem
              key={region.id}
              name={region.name}
              thumbnail={region.thumbnail}
              selected={region.id === selectedRegion?.id}
              onClick={() => handleRegionSelect(region)}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 