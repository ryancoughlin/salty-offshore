import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState, useCallback, Suspense, memo } from 'react';
import type { MapRef, MapLayerMouseEvent, ViewState } from 'react-map-gl';
import Map, { NavigationControl, ScaleControl } from 'react-map-gl';
import { MapLayer } from './MapLayer';
import { SpotLayer } from './SpotLayer';
import { RegionBoundsLayer } from './RegionBoundsLayer';
import { Grid } from './Grid';
import { RegionInfo } from '../../types/api';
import useMapStore from '../../store/useMapStore';
import { useMapInitialization } from '../../hooks/useMapInitialization';
import { MapErrorBoundary } from './MapErrorBoundary';
import { BathymetryLayer } from './BathymetryLayer';

// Constants
const MAP_CONSTANTS = {
    DEFAULT_VIEW: {
        longitude: -71.0,
        latitude: 39.0,
        zoom: 5,
    },
    BOUNDS: {
        PADDING: 50,
        ANIMATION_DURATION: 1000,
        MAX_ZOOM: 10,
        MIN_ZOOM: 6,
    },
    STYLE_URL: 'mapbox://styles/snowcast/clwc3ly3001d401p926gthsj8',
} as const;

interface MapProps {
    regions: RegionInfo[];
}

const SaltyMap: React.FC<MapProps> = ({ regions }) => {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState<Partial<ViewState>>(MAP_CONSTANTS.DEFAULT_VIEW);
    const [gridSize] = useState(1);
    const [showGrid] = useState(true);

    const {
        selectedRegion,
        selectedDataset,
        selectedDate,
        setCursorPosition,
        setMapRef,
        selectDefaultDataset,
        selectDataset
    } = useMapStore();

    const { isStyleLoaded, handleMapLoad } = useMapInitialization(mapRef, setMapRef);

    const handleBoundsFitting = useCallback(() => {
        if (!isStyleLoaded || !selectedRegion?.bounds || !mapRef.current) return;

        try {
            mapRef.current.fitBounds(selectedRegion.bounds, {
                padding: MAP_CONSTANTS.BOUNDS.PADDING,
                duration: MAP_CONSTANTS.BOUNDS.ANIMATION_DURATION,
                maxZoom: MAP_CONSTANTS.BOUNDS.MAX_ZOOM
            });
        } catch (error) {
            console.error('Error fitting bounds:', error);
        }
    }, [selectedRegion, isStyleLoaded]);

    useEffect(() => {
        handleBoundsFitting();
    }, [handleBoundsFitting]);

    const handleMove = useCallback((evt: { viewState: ViewState }) => {
        setViewState(evt.viewState);
    }, []);

    const handleMouseMove = useCallback((event: MapLayerMouseEvent) => {
        setCursorPosition({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat
        });
    }, [setCursorPosition]);

    useEffect(() => {
        if (selectedRegion && !selectedDataset) {
            const regionData = {
                id: selectedRegion.id,
                datasets: selectedRegion.datasets
            };
            selectDefaultDataset(regionData);
        }
    }, [selectedRegion, selectedDataset, selectDefaultDataset]);

    return (
        <MapErrorBoundary>
            <div className="relative w-full h-full">
                <Map
                    ref={mapRef}
                    {...viewState}
                    onMove={handleMove}
                    onMouseMove={handleMouseMove}
                    onLoad={handleMapLoad}
                    mapStyle={MAP_CONSTANTS.STYLE_URL}
                    className="w-full h-full"
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    maxZoom={MAP_CONSTANTS.BOUNDS.MAX_ZOOM}
                    minZoom={MAP_CONSTANTS.BOUNDS.MIN_ZOOM}
                    optimizeForTerrain={false}
                >
                    {isStyleLoaded && (
                        <Suspense fallback={null}>
                            <MapControls />
                            <Grid
                                visible={showGrid}
                                gridSize={gridSize}
                            />
                            <SpotLayer />
                            <MapLayerComponents
                                selectedRegion={selectedRegion}
                                selectedDataset={selectedDataset}
                                selectedDate={selectedDate}
                                mapRef={mapRef}
                            />
                            <BathymetryLayer />
                        </Suspense>
                    )}
                </Map>
            </div>
        </MapErrorBoundary>
    );
};

const MapControls = () => (
    <>
        <NavigationControl position="top-right" />
        <ScaleControl maxWidth={100} unit="nautical" position="bottom-left" />
    </>
);

interface MapLayerComponentsProps {
    selectedRegion: RegionInfo | null;
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