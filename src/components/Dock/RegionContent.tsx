import { RegionPicker } from '../RegionPicker';
import { CursorData } from './CursorData';
import { LayerControls } from '../LayerControls';
import type { Region, RegionInfo } from '../../types/api';

interface RegionContentProps {
  regions: RegionInfo[];
  selectedRegion: RegionInfo | null;
  onRegionSelect: (region: RegionInfo) => void;
  regionData: Region | null;
}

export default function RegionContent({
  regions,
  selectedRegion,
  onRegionSelect,
  regionData
}: RegionContentProps) {
  return (
    <div className="flex-1 border-l border-white/10 flex flex-col">
      <RegionPicker
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={onRegionSelect}
      />
      <div className="flex-1 overflow-y-auto">
        <CursorData />
        {regionData && <LayerControls region={regionData} />}
      </div>
    </div>
  );
} 