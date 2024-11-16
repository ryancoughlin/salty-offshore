import { WaterTemperatureDisplay } from '../WaterTemperatureDisplay';
import { GeographicInspector } from '../GeographicInspector';
import useMapStore from '../../store/useMapStore';

export const CursorData = () => {
  const { selectedDataset, cursorPosition, mapRef } = useMapStore();

  if (!selectedDataset || !cursorPosition || !mapRef) return null;

  return (
    <div className="self-stretch h-36 p-4 bg-neutral-950 border-b border-white/20 flex-col gap-4 flex">
      <WaterTemperatureDisplay
        dataset={selectedDataset}
        cursorPosition={cursorPosition}
        mapRef={mapRef}
      />
      <GeographicInspector cursorPosition={cursorPosition} />
    </div>
  );
}; 