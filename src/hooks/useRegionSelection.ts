import { useCallback } from 'react';
import type { Region } from '../types/api';
import { useRegionDatasets } from './useRegionDatasets';

export const useRegionSelection = (onRegionSelect: (region: Region) => void) => {
  const { getRegionData } = useRegionDatasets();

  const handleRegionSelect = useCallback((region: Region) => {
    const fullRegionData = getRegionData(region.id);
    if (fullRegionData) {
      onRegionSelect(fullRegionData);
    }
  }, [onRegionSelect, getRegionData]);

  const sortedRegions = (regions: Region[]) => 
    [...regions].sort((a, b) => a.name.localeCompare(b.name));

  return {
    handleRegionSelect,
    sortedRegions,
  };
}; 