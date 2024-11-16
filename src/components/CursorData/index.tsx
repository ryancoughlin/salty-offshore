import { WaterTemperatureDisplay } from '../WaterTemperatureDisplay';
import { GeographicInspector } from '../GeographicInspector';
import type { Dataset } from '../../types/api';
import type { Coordinate } from '../../types/core';

interface CursorDataProps {
  dataset: Dataset | null;
  cursorPosition: Coordinate | null;
  mapRef: mapboxgl.Map | null;
}

export const CursorData: React.FC<CursorDataProps> = ({
  dataset,
  cursorPosition,
  mapRef
}) => {
  if (!dataset || !cursorPosition || !mapRef) return null;

  return (
    <div className="self-stretch p-4 bg-neutral-950 border-b border-white/20 flex-col gap-4 flex">
      <WaterTemperatureDisplay
        dataset={dataset}
        cursorPosition={cursorPosition}
        mapRef={mapRef}
      />
      <GeographicInspector cursorPosition={cursorPosition} />
    </div>
  );
}; 