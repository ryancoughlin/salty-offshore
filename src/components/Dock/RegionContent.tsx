import { RegionPicker } from '../RegionPicker';
import { CursorData } from '../CursorData';
import LayerControls from '../LayerControls';
import CollapseButton from './CollapseButton';
import type { Region } from '../../types/api';

interface RegionContentProps {
  regions: Region[];
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  regionData: Region | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function RegionContent({
  regions,
  selectedRegion,
  onRegionSelect,
  regionData,
  isCollapsed,
  onToggleCollapse
}: RegionContentProps) {
  if (isCollapsed) {
    return (
      <div className="flex-1 relative">
        <CollapseButton isCollapsed={isCollapsed} onToggle={onToggleCollapse} />
      </div>
    );
  }

  return (
    <div className="flex-1 border-l border-white/10 flex flex-col relative">
      <CollapseButton isCollapsed={isCollapsed} onToggle={onToggleCollapse} />
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