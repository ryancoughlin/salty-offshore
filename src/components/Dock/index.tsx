import AppBar from './AppBar';
import RegionContent from './RegionContent';
import type { Region } from '../../types/api';

interface DockProps {
  regions: Region[];
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  regionData: Region | null;
}

// Changed to export default for consistency
export default function Dock({
  regions,
  selectedRegion,
  onRegionSelect,
  regionData
}: DockProps) {
  return (
    <div className="w-96 h-full flex">
      <AppBar />
      <RegionContent
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={onRegionSelect}
        regionData={regionData}
      />
    </div>
  );
} 