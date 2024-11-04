import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { MapRef, MapLayerMouseEvent, ViewState } from 'react-map-gl';
import Map, { NavigationControl, ScaleControl, Layer, Source } from 'react-map-gl';
import { MapLayer } from './MapLayer';
import { SpotLayer } from './SpotLayer';
import { DateTimeline } from '../DateTimeline';
import { Grid } from './Grid';
import type { Coordinate } from '../../types/core';
import { CurrentStatusBar } from '../CurrentStatusBar';
import { RegionInfo } from '../../types/api';
import useMapStore from '../../store/useMapStore';

interface MapProps {
    regions: RegionInfo[];
}

const DEFAULT_VIEW_STATE = {
    longitude: -71.0,
    latitude: 39.0,
    zoom: 5,
} as const;

const SaltyMap: React.FC<MapProps> = ({ regions }) => {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState<Partial<ViewState>>(DEFAULT_VIEW_STATE);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);
    const [gridSize] = useState(1);
    const [showGrid] = useState(true);
    const [cursorPosition, setCursorPosition] = useState<Coordinate | null>(null);

    const {
        selectedRegion,
        selectedDataset,
        selectedDate,
        selectRegion,
        selectDate
    } = useMapStore();

    const handleMapLoad = () => {
        setIsStyleLoaded(true);
    };

    useEffect(() => {
        if (isStyleLoaded && selectedRegion?.bounds && mapRef.current) {
            mapRef.current.fitBounds(selectedRegion.bounds, {
                padding: 50,
                duration: 500
            });
        }
    }, [selectedRegion, isStyleLoaded]);

    const handleMove = useCallback((evt: { viewState: ViewState }) => {
        setViewState(evt.viewState);
    }, []);

    const handleMouseMove = useCallback((event: MapLayerMouseEvent) => {
        if (event.lngLat) {
            setCursorPosition({
                longitude: event.lngLat.lng,
                latitude: event.lngLat.lat
            });
        }
    }, []);

    const getRegionBoundsGeoJSON = useCallback(() => {
        if (!selectedRegion?.bounds) return null;

        const [[minLng, minLat], [maxLng, maxLat]] = selectedRegion.bounds;
        return {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[
                    [minLng, minLat],
                    [maxLng, minLat],
                    [maxLng, maxLat],
                    [minLng, maxLat],
                    [minLng, minLat]
                ]]
            },
            properties: {}
        };
    }, [selectedRegion]);

    return (
        <div className="relative w-full h-full">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={handleMove}
                onMouseMove={handleMouseMove}
                onLoad={handleMapLoad}
                mapStyle="mapbox://styles/snowcast/cm2xtr8gl00lu01pd38l35unx"
                style={{ width: '100%', height: '100%' }}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                maxZoom={10}
                minZoom={6}
                optimizeForTerrain={false}
            >
                {isStyleLoaded && (
                    <>
                        <NavigationControl position="top-right" />
                        <ScaleControl maxWidth={100} unit="nautical" position="bottom-left" />

                        {selectedRegion && selectedDataset && selectedDate && (
                            <MapLayer />
                        )}

                        <Grid
                            visible={showGrid}
                            gridSize={gridSize}
                        />
                        <SpotLayer />

                        {selectedRegion?.bounds && (
                            <Source
                                id="selected-region-bounds"
                                type="geojson"
                                data={getRegionBoundsGeoJSON()}
                            >
                                <Layer
                                    id="region-bounds-line"
                                    type="line"
                                    paint={{
                                        'line-color': '#000000',
                                        'line-width': 2
                                    }}
                                />
                            </Source>
                        )}
                    </>
                )}
            </Map>

            <CurrentStatusBar
                regions={regions}
                selectedRegion={selectedRegion}
                onRegionSelect={selectRegion}
                cursorPosition={cursorPosition}
                mapRef={mapRef.current?.getMap() ?? null}
                dataset={selectedDataset}
            />

            {selectedRegion && selectedDataset && (
                <DateTimeline
                    dataset={selectedDataset}
                    selectedDate={selectedDate}
                    onDateSelect={selectDate}
                />
            )}
        </div>
    );
};

export default SaltyMap; 