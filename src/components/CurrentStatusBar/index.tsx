import { ChevronDownIcon } from '@heroicons/react/24/outline';
import RegionPicker from '../RegionPicker';
import { TemperatureOverlay } from '../TemperatureOverlay';
import { GeographicInspector } from '../GeographicInspector';
import type { Dataset, RegionInfo } from '../../types/api';
import type { Coordinate } from '../../types/core';

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
        <div className="absolute top-0 left-0 right-0 bg-neutral-950">
            <div className="flex justify-start items-center h-[86px] gap-[89px] px-6">
                <div className="flex justify-center items-center self-stretch relative gap-2 px-6 border-r border-white/20">
                    <RegionPicker
                        regions={regions}
                        selectedRegion={selectedRegion}
                        onRegionSelect={onRegionSelect}
                    >

                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-semibold text-white">
                                {selectedRegion?.name || 'Select Region'}
                            </p>
                            <ChevronDownIcon className="w-6 h-6 text-white" />
                        </div>
                    </RegionPicker>
                </div>

                <div className="flex justify-start items-center gap-8">
                    {dataset && cursorPosition && (
                        <TemperatureOverlay
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
        </div>
    );
}; 