import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLayer } from './MapLayer';
import type { Dataset, Region } from '../../types/api';
import type { DatasetId } from '../../types/Layer';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapProps {
    region?: Region;
    datasets: Dataset[];
    visibleLayers: Set<DatasetId>;
    selectedDate: string;
}

const DEFAULT_VIEW_STATE = {
    longitude: -71.0,
    latitude: 39.0,
    zoom: 5
};

const SaltyMap: React.FC<MapProps> = ({
    region,
    datasets,
    visibleLayers,
    selectedDate
}) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (region?.bounds && mapRef.current) {
            mapRef.current.fitBounds(region.bounds, {
                padding: 50,
                duration: 1000
            });
        }
    }, [region]);

    return (
        <div className="w-full h-full relative">
            <Map
                ref={mapRef}
                reuseMaps
                initialViewState={DEFAULT_VIEW_STATE}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                renderWorldCopies={false}
                maxZoom={12}
                minZoom={3}
                interactiveLayerIds={datasets.map(d => `${d.id}-data`)}
            >
                <NavigationControl position="top-right" />
                {region && datasets.map((dataset) => (
                    <MapLayer
                        key={dataset.id}
                        region={region}
                        dataset={dataset}
                        visible={visibleLayers.has(dataset.id)}
                        selectedDate={selectedDate}
                        visibleLayers={visibleLayers}
                    />
                ))}
            </Map>
        </div>
    );
};

export default SaltyMap; 