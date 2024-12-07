import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Region } from '../../types/api';
import { RegionSelectItem } from './RegionSelectItem';
import { RegionPickerModal } from './RegionPickerModal';
import { useRegionSelection } from '../../hooks/useRegionSelection';

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
  const [showModal, setShowModal] = useState(!selectedRegion);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { handleRegionSelect, sortedRegions } = useRegionSelection(onRegionSelect);

  const handleSelect = (region: Region) => {
    handleRegionSelect(region);
    setIsOpen(false);
  };

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
    <>
      <div ref={dropdownRef} className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-neutral-900 transition-colors duration-150 h-16 px-4 border-b border-white/20 flex items-center justify-between cursor-pointer"
        >
          <div className="text-white text-xl font-semibold font-['Spline Sans']">
            {selectedRegion?.name || 'Select Region'}
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-white transform transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 bg-neutral-950 border-b border-white/20 z-50">
            {sortedRegions(regions).map(region => (
              <RegionSelectItem
                key={region.id}
                name={region.name}
                thumbnail={region.thumbnail}
                selected={region.id === selectedRegion?.id}
                onClick={() => handleSelect(region)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <RegionPickerModal
          regions={regions}
          onRegionSelect={onRegionSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}; 