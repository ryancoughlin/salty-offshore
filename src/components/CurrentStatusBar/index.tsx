import { RegionPicker } from '../RegionPicker';
import { WaterTemperatureDisplay } from '../WaterTemperatureDisplay';
import { GeographicInspector } from '../GeographicInspector';
import type { Dataset, RegionInfo } from '../../types/api';
import type { Coordinate } from '../../types/core';
import ColorGradient from '../ColorGradient';

interface CurrentStatusBarProps {
    regions: RegionInfo[];
    selectedRegion: RegionInfo | null;
    onRegionSelect: (region: RegionInfo) => void;
    cursorPosition: Coordinate | null;
    mapRef: mapboxgl.Map | null;
    dataset: Dataset | null;
}

export const CurrentStatusBar = ({
    regions = [],
    selectedRegion,
    onRegionSelect,
    cursorPosition,
    mapRef,
    dataset
}: CurrentStatusBarProps) => {
    return (
        <div className="flex absolute top-0 left-0 right-0 bg-neutral-950">
            <div className="flex justify-start items-center h-[86px] gap-[89px] px-6">
                <RegionPicker
                    regions={regions}
                    selectedRegion={selectedRegion}
                    onRegionSelect={onRegionSelect}
                />
            </div>

            <div className="flex justify-start items-center gap-8">
                <ColorGradient min={36} max={80} />
                {dataset && cursorPosition && (
                    <WaterTemperatureDisplay
                        dataset={dataset}
                        cursorPosition={cursorPosition}
                        mapRef={mapRef}
                    />
                )}
                <GeographicInspector
                    mapRef={mapRef}
                    cursorPosition={cursorPosition}
                />
            </div>
        </div>
    );
}; 