import 'mapbox-gl/dist/mapbox-gl.css';
import type { Dataset, Region } from '../../types/api';
import type { ISODateString } from '../../types/date';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { MapRef } from 'react-map-gl';
import Map, { NavigationControl, ScaleControl } from 'react-map-gl';
import { MapLayer } from './MapLayer';
import { SpotLayer } from './SpotLayer';
import { DateTimeline } from '../DateTimeline';
// import { GridControl } from './GridControl';
import { Grid } from './Grid';
import type { Coordinate } from '../../types/core';
import { CurrentStatusBar } from '../CurrentStatusBar';
import { RegionInfo } from '../../types/api';

interface MapProps {
    region?: Region | null;
    datasets: Dataset[];
    selectedDataset: Dataset | null;
    selectedDate: ISODateString | null;
    onDateSelect: (date: ISODateString) => void;
    regions: RegionInfo[];
    selectedRegion: RegionInfo | null;
    onRegionSelect: (region: RegionInfo) => void;
}

const DEFAULT_VIEW_STATE = {
    longitude: -71.0,
    latitude: 39.0,
    zoom: 5,
} as const;

const SaltyMap: React.FC<MapProps> = ({
    region,
    datasets,
    selectedDataset,
    selectedDate,
    onDateSelect,
    regions,
    selectedRegion,
    onRegionSelect
}) => {
    const mapRef = useRef<MapRef>(null);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);
    const [gridSize, setGridSize] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [cursorPosition, setCursorPosition] = useState<Coordinate | null>(null);

    const handleMapLoad = () => {
        setIsStyleLoaded(true);
    };

    useEffect(() => {
        if (isStyleLoaded && region?.bounds && mapRef.current) {
            mapRef.current.fitBounds(region.bounds, {
                padding: 50,
                duration: 500
            });
        }
    }, [region, isStyleLoaded]);

    console.log('selectedDataset', selectedDataset);
    console.log('region', region);

    const handleMouseMove = useCallback((event: mapboxgl.MapLayerMouseEvent) => {
        setCursorPosition(event.lngLat);
    }, []);

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                reuseMaps
                onLoad={handleMapLoad}
                initialViewState={DEFAULT_VIEW_STATE}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/snowcast/cm2xtr8gl00lu01pd38l35unx"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                renderWorldCopies={false}
                maxZoom={10}
                minZoom={6}
                interactiveLayerIds={datasets.map(d => `${d.id}-data`).concat('spots-points')}
                optimizeForTerrain={false}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setCursorPosition(null)}
            >
                {isStyleLoaded && (
                    <>
                        <NavigationControl position="top-right" />
                        <ScaleControl
                            maxWidth={100}
                            unit="nautical"
                            position="bottom-left"
                        />

                        {region && selectedDataset && (
                            <MapLayer
                                region={region}
                                dataset={selectedDataset}
                                selectedDate={selectedDate || ''}
                            />
                        )}

                        <Grid
                            visible={showGrid}
                            gridSize={gridSize}
                        />
                        <SpotLayer />
                    </>
                )}
            </Map>

            <CurrentStatusBar
                regions={regions}
                selectedRegion={selectedRegion}
                onRegionSelect={onRegionSelect}
                cursorPosition={cursorPosition}
                mapRef={mapRef.current?.getMap() ?? null}
                dataset={selectedDataset}
            />

            {region && selectedDataset && (
                <DateTimeline
                    dataset={selectedDataset}
                    selectedDate={selectedDate}
                    onDateSelect={onDateSelect}
                />
            )}
        </div>
    );
};

export default SaltyMap; 