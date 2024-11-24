import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useMapStore from '../../../store/useMapStore';
import { formatDateForDisplay } from '../../../utils/date';
import { useDateFiltering } from '../../../hooks/useDateFiltering';

export const DateNavigator: React.FC = () => {
  const { selectedDataset, selectedDate, selectDate } = useMapStore();
  
  const availableDates = useDateFiltering(selectedDataset || { dates: [] });

  if (!selectedDataset || !selectedDate) return null;

  const currentIndex = availableDates.indexOf(selectedDate);
  const hasNext = currentIndex < availableDates.length - 1;
  const hasPrevious = currentIndex > 0;
  
  const handleNext = () => {
    if (hasNext) {
      selectDate(availableDates[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      selectDate(availableDates[currentIndex - 1]);
    }
  };

  const formattedDate = formatDateForDisplay(new Date(selectedDate));

  return (
    <div className="absolute bottom-8 left-8 z-10 bg-neutral-950/90 backdrop-blur-sm font-medium rounded-lg shadow-lg flex items-center">
      <button
        onClick={handlePrevious}
        disabled={!hasPrevious}
        className={`p-2 ${
          hasPrevious 
            ? 'text-white/90 hover:text-white hover:bg-white/10' 
            : 'text-white/30 cursor-not-allowed'
        } rounded-l-lg transition-colors`}
        aria-label="Previous date"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      
      <div className="px-4 py-2 text-white/90 font-medium border-l border-r border-white/10">
        {formattedDate}
      </div>
      
      <button
        onClick={handleNext}
        disabled={!hasNext}
        className={`p-2 ${
          hasNext 
            ? 'text-white/90 hover:text-white hover:bg-white/10' 
            : 'text-white/30 cursor-not-allowed'
        } rounded-r-lg transition-colors`}
        aria-label="Next date"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}; 