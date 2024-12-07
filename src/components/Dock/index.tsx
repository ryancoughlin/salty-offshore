import AppBar from './AppBar';
import RegionContent from './RegionContent';
import { useState } from 'react';
import type { Region } from '../../types/api';

interface DockProps {
  regions: Region[];
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  regionData: Region | null;
}

export default function Dock({
  regions,
  selectedRegion,
  onRegionSelect,
  regionData
}: DockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-[364px]'} flex transition-all duration-150 ease-in-out`}>
      <AppBar />
      <RegionContent
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionSelect={onRegionSelect}
        regionData={regionData}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
    </div>
  );
} 