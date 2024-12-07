import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useCallback, Suspense, memo } from 'react';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl';
import Map from 'react-map-gl';
import { BathymetryLayer } from './BathymetryLayer';
import { Grid } from './Grid';
import { SpotLayer } from './SpotLayer';
import { MapControls } from './MapControls';
import { DatasetLayers } from './DatasetLayers';
import { MapErrorBoundary } from './MapErrorBoundary';
import { useMapStore } from '../../store/useMapStore';
import { useMapToolsStore } from '../../store/mapToolsStore';
import { useMapInitialization } from '../../hooks/useMapInitialization';
import { useMapCursor } from '../../hooks/useMapCursor';
import { useMapViewState } from '../../hooks/useMapViewState';
import { MAP_CONSTANTS } from '../../constants/map';
import { useLayerStore } from '../../store/useLayerStore';
import StationsLayer from './StationsLayer';
import { MapToolbar } from './MapToolbar';
import { DistanceTool } from '../MapTools/DistanceTool';
import { MeasurementHelper } from '../MapTools/DistanceTool/MeasurementHelper';

const OceanographicMap: React.FC = () => {
    const mapRef = useRef<MapRef>(null);
    const {
        viewState,
        cursor,
        handleViewStateChange,
    } = useMapViewState();

    const {
        selectedRegion,
        selectedDataset,
        selectedDate,
        setCursorPosition,
        setMapRef,
        selectDate,
    } = useMapStore();

    const { layerSettings } = useLayerStore();

    const {
        isToolActive,
        activeTool,
        addPoint,
        updateMousePosition
    } = useMapToolsStore();

    const { mapLoaded, handleMapLoad } = useMapInitialization(mapRef, setMapRef);

    const handleMouseMove = useMapCursor(
        setCursorPosition,
        updateMousePosition,
        isToolActive,
        activeTool
    );

    const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
        if (isToolActive && activeTool === 'distance') {
            addPoint([event.lngLat.lng, event.lngLat.lat]);
        }
    }, [isToolActive, activeTool, addPoint]);

    const gridSettings = layerSettings.get('grid');

    return (
        <MapErrorBoundary>
            <div className="relative w-full h-full">
                <Map
                    ref={mapRef}
                    {...viewState}
                    onMove={handleViewStateChange}
                    onMouseMove={handleMouseMove}
                    onClick={handleMapClick}
                    onLoad={handleMapLoad}
                    mapStyle='mapbox://styles/snowcast/cm3rd1mik008801s97a8db8w6'
                    style={{ width: '100%', height: '100%' }}
                    cursor={cursor}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    maxZoom={MAP_CONSTANTS.ZOOM_LIMITS.MAX}
                    minZoom={MAP_CONSTANTS.ZOOM_LIMITS.MIN}
                    optimizeForTerrain={false}
                >
                    {mapLoaded && (
                        <Suspense fallback={null}>
                            <MapControls />
                            <MapToolbar
                                dataset={selectedDataset || undefined}
                                selectedDate={selectedDate}
                                onDateSelect={selectDate}
                            />
                            <MeasurementHelper />
                            <DistanceTool />
                            <DatasetLayers
                                selectedRegion={selectedRegion}
                                selectedDataset={selectedDataset}
                                selectedDate={selectedDate}
                                mapRef={mapRef}
                            />
                            <BathymetryLayer />
                            <Grid
                                visible={gridSettings?.visible ?? false}
                                opacity={gridSettings?.opacity ?? 0.7}
                            />
                            <SpotLayer />
                            <StationsLayer />
                        </Suspense>
                    )}
                </Map>
            </div>
        </MapErrorBoundary>
    );
};

export default memo(OceanographicMap); 