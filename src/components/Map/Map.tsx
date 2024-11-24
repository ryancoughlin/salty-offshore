import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState, useCallback, Suspense, memo } from 'react';
import type { MapRef, MapLayerMouseEvent, ViewState } from 'react-map-gl';
import Map, { NavigationControl, ScaleControl } from 'react-map-gl';
import { MapLayer } from './MapLayer';
import { RegionBoundsLayer } from './RegionBoundsLayer';
import { Grid } from './Grid';
import useMapStore from '../../store/useMapStore';
import { useMapInitialization } from '../../hooks/useMapInitialization';
import { MapErrorBoundary } from './MapErrorBoundary';
import { BathymetryLayer } from './BathymetryLayer';
import { SpotLayer } from './SpotLayer';
import { MapTools } from '../MapTools';
import { useMapToolsStore } from '../../store/mapToolsStore';
import type { Region, Dataset } from '../../types/api';

const MAP_CONSTANTS = {
    DEFAULT_VIEW: {
        longitude: -71.0,
        latitude: 39.0,
        zoom: 6,
    }
} as const;

const SaltyMap: React.FC = () => {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState<Partial<ViewState>>(MAP_CONSTANTS.DEFAULT_VIEW);
    const [cursor, setCursor] = useState<string>('default');

    const {
        selectedRegion,
        selectedDataset,
        selectedDate,
        setCursorPosition,
        setMapRef,
        selectDefaultDataset,
    } = useMapStore();

    const { 
      isToolActive, 
      activeTool,
      addPoint, 
      updateMousePosition 
    } = useMapToolsStore();

    const { isStyleLoaded, handleMapLoad } = useMapInitialization(mapRef, setMapRef);

    const fitToRegionBounds = useCallback(() => {
        if (!isStyleLoaded || !selectedRegion?.bounds || !mapRef.current) return;

        try {
            mapRef.current.fitBounds(selectedRegion.bounds, {
                padding: 10,
                duration: 2400,
                maxZoom: 7
            });
        } catch (error) {
            console.error('Error fitting bounds:', error);
        }
    }, [selectedRegion, isStyleLoaded]);

    useEffect(() => {
        fitToRegionBounds();
    }, [fitToRegionBounds]);

    const handleMove = useCallback((evt: { viewState: ViewState }) => {
        setViewState(evt.viewState);
    }, []);

    const handleMouseMove = useCallback((event: MapLayerMouseEvent) => {
        if (isToolActive && activeTool === 'distance') {
            updateMousePosition([event.lngLat.lng, event.lngLat.lat]);
        } else {
            setCursorPosition({
                longitude: event.lngLat.lng,
                latitude: event.lngLat.lat
            });
        }
    }, [isToolActive, activeTool, updateMousePosition, setCursorPosition]);

    const handleClick = useCallback((event: MapLayerMouseEvent) => {
        if (isToolActive && activeTool === 'distance') {
            addPoint([event.lngLat.lng, event.lngLat.lat]);
        }
    }, [isToolActive, activeTool, addPoint]);

    useEffect(() => {
        if (selectedRegion && !selectedDataset) {
            selectDefaultDataset(selectedRegion);
        }
    }, [selectedRegion, selectedDataset, selectDefaultDataset]);

    // Update cursor only when measure tool is active
    useEffect(() => {
        if (isToolActive && activeTool === 'distance') {
            setCursor('crosshair');
        } else {
            setCursor('default');
        }
    }, [isToolActive, activeTool]);

    return (
        <MapErrorBoundary>
            <div className="relative w-full h-full">
                <Map
                    ref={mapRef}
                    {...viewState}
                    onMove={handleMove}
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                    onLoad={handleMapLoad}
                    mapStyle='mapbox://styles/snowcast/cm3rd1mik008801s97a8db8w6'
                    style={{ width: '100%', height: '100%' }}
                    cursor={cursor}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    maxZoom={10}
                    minZoom={4}
                    optimizeForTerrain={false}
                >
                    <Suspense fallback={null}>
                        <MapControls />
                        <MapTools />
                        <MapLayerComponents
                            selectedRegion={selectedRegion}
                            selectedDataset={selectedDataset}
                            selectedDate={selectedDate}
                            mapRef={mapRef}
                        />

                        <BathymetryLayer />
                        <Grid />
                        <SpotLayer />
                    </Suspense>
                </Map>
            </div>
        </MapErrorBoundary>
    );
};

const MapControls = memo(() => (
    <>
        <NavigationControl position="top-right" />
        <ScaleControl maxWidth={100} unit="nautical" position="bottom-left" />
    </>
));

interface MapLayerComponentsProps {
    selectedRegion: Region | null;
    selectedDataset: Dataset | null;
    selectedDate: string | null;
    mapRef: React.RefObject<MapRef>;
}

const MapLayerComponents = memo(({
    selectedRegion,
    selectedDataset,
    selectedDate,
    mapRef
}: MapLayerComponentsProps) => {
    const { selectDataset } = useMapStore();

    // Handle initial dataset selection
    useEffect(() => {
        if (selectedRegion?.datasets && !selectedDataset) {
            const sstDataset = selectedRegion.datasets.find(
                (d) => d.id === "LEOACSPOSSTL3SnrtCDaily"
            );
            if (sstDataset) {
                selectDataset(sstDataset);
            }
        }
    }, [selectedRegion, selectedDataset, selectDataset]);

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

export default memo(SaltyMap); 