import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Region } from '../../types/api';
import { RegionImage } from './RegionImage';
import { useRegionSelection } from '../../hooks/useRegionSelection';
import { useMapStore } from '../../store/useMapStore';

interface RegionPickerModalProps {
  regions: Region[];
  onRegionSelect: (region: Region) => void;
  onClose: () => void;
}

export const RegionPickerModal: React.FC<RegionPickerModalProps> = ({
  regions,
  onRegionSelect,
  onClose,
}) => {
  const isFirstVisit = useMapStore(state => state.isFirstVisit);
  const initializeFromPreferences = useMapStore(state => state.initializeFromPreferences);
  const { handleRegionSelect, sortedRegions } = useRegionSelection(onRegionSelect);

  useEffect(() => {
    initializeFromPreferences();
  }, [initializeFromPreferences]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isFirstVisit) return null;

  const handleSelect = (region: Region) => {
    handleRegionSelect(region);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-neutral-950 rounded-lg max-w-4xl w-full mx-4 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-['Spline Sans'] text-white font-bold">
              Welcome Aboard
            </h2>
            <p className="text-white/60 mt-2">
              Select a region to begin your navigation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedRegions(regions).map((region) => (
            <button
              key={region.id}
              onClick={() => handleSelect(region)}
              className="group relative overflow-hidden rounded-lg aspect-video focus:outline-none focus:ring-2 focus:ring-blue-500 border-1 border-neutral-900"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(region)}
              aria-label={`Select ${region.name} region`}
            >
              <RegionImage
                thumbnail={region.thumbnail}
                name={region.name}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-['Spline Sans'] font-semibold text-lg">
                  {region.name}
                </h3>
              </div>
              <div className="absolute inset-0 ring-1 ring-white/20 rounded-lg pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 