import { memo } from 'react';
import type { MapRef } from 'react-map-gl';
import { MapLayer } from './MapLayer';
import { RegionBoundsLayer } from './RegionBoundsLayer';
import type { Region, Dataset } from '../../types/api';

interface DatasetLayersProps {
    selectedRegion: Region | null;
    selectedDataset: Dataset | null;
    selectedDate: string | null;
    mapRef: React.RefObject<MapRef>;
}

export const DatasetLayers = memo(({
    selectedRegion,
    selectedDataset,
    selectedDate,
    mapRef
}: DatasetLayersProps) => {
    if (!selectedRegion || !selectedDataset || !selectedDate || !mapRef.current) {
        return null;
    }

    return (
        <>
            <MapLayer map={mapRef.current.getMap()} />
            <RegionBoundsLayer bounds={selectedRegion.bounds} />
        </>
    );
});

DatasetLayers.displayName = 'DatasetLayers'; 