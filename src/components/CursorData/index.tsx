import { WaterTemperatureDisplay } from '../WaterTemperatureDisplay';
import { DatasetRangeDisplay } from '../DatasetRangeDisplay';
import { GeographicInspector } from '../GeographicInspector';
import useMapStore from '../../store/useMapStore';

export const CursorData = () => {
  const { selectedDataset, cursorPosition, mapRef, ranges } = useMapStore();

  if (!selectedDataset || !cursorPosition || !mapRef) return null;

  return (
    <div className="self-stretch h-36 p-4 bg-neutral-950 border-b border-white/20 flex-col gap-4 flex">
      <div className="flex flex-col gap-1">
        <WaterTemperatureDisplay
          cursorPosition={cursorPosition}
          mapRef={mapRef}
        />
        <DatasetRangeDisplay
          datasetKey={selectedDataset}
          ranges={ranges}
        />
      </div>
      <GeographicInspector cursorPosition={cursorPosition} />
    </div>
  );
}; 