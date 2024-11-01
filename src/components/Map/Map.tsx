import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLayer } from './MapLayer';
import { SpotLayer } from './SpotLayer';
import type { Dataset, Region } from '../../types/api';
import type { DatasetId } from '../../types/Layer';
import { useEffect, useRef, useState } from 'react';
import Map, { MapRef, NavigationControl } from 'react-map-gl';
import { GeographicInspector } from '../GeographicInspector';

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
    const mapRef = useRef<MapRef>(null);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);

    const handleMapLoad = () => {
        setIsStyleLoaded(true);
    };

    useEffect(() => {
        if (isStyleLoaded && region?.bounds && mapRef.current) {
            mapRef.current.fitBounds(region.bounds, {
                padding: 50,
                duration: 1000
            });
        }
    }, [region, isStyleLoaded]);

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
                interactiveLayerIds={[...datasets.map(d => `${d.id}-data`), 'spots-points']}
            >
                {isStyleLoaded && (
                    <>
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
                        <SpotLayer />
                        <GeographicInspector
                            mapRef={mapRef.current}
                            datasets={datasets.filter(d => d.category === 'sst')}
                            visibleLayers={visibleLayers}
                        />
                    </>
                )}
            </Map>
        </div>
    );
};

export default SaltyMap; 