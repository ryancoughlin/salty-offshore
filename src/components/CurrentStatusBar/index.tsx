import { RegionPicker } from '../RegionPicker';
// import { WaterTemperatureDisplay } from '../WaterTemperatureDisplay';
// import GeographicInspector from '../GeographicInspector';
import type { Dataset, RegionInfo } from '../../types/api';
import type { Coordinate } from '../../types/core';
import { ColorGradient } from '../ColorGradient';

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
        <div className="flex bg-neutral-950">
            <div className="flex justify-start items-center h-20">
                <RegionPicker
                    regions={regions}
                    selectedRegion={selectedRegion}
                    onRegionSelect={onRegionSelect}
                />
            </div>

            <div className="flex justify-start items-center gap-8">
                <ColorGradient min={36} max={80} />
                {/* {dataset && cursorPosition && (
                    <WaterTemperatureDisplay
                        dataset={dataset}
                        cursorPosition={cursorPosition}
                        mapRef={mapRef}
                    />
                )} */}
                {/* <GeographicInspector
                    cursorPosition={cursorPosition}
                /> */}
            </div>
        </div>
    );
}; 