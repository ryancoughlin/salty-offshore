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
    const [mapRef, setMapRef] = useState<mapboxgl.Map | null>(null);
    const mapContainer = useRef<MapRef>(null);

    useEffect(() => {
        if (region?.bounds && mapRef) {
            mapRef.fitBounds(region.bounds, {
                padding: 50,
                duration: 1000
            });
        }
    }, [region]);

    // Debug source loading with more detail
    useEffect(() => {
        if (!mapRef) return;

        mapRef.on('sourcedata', (e) => {
            if (e.sourceId?.includes('data-source')) {
                console.log('Source event:', {
                    sourceId: e.sourceId,
                    dataType: e.dataType,
                    sourceDataType: e.sourceDataType,
                    isSourceLoaded: e.isSourceLoaded
                });
            }
        });
    }, [mapRef]);

    // Debug datasets at Map level
    console.log('Map component:', {
        hasRegion: !!region,
        region,
        datasetCount: datasets.length,
        sstDatasets: datasets.filter(d => d.category === 'sst')
    });

    return (
        <div className="w-full h-full relative">
            <Map
                ref={(ref) => {
                    mapContainer.current = ref;
                    if (ref) {
                        setMapRef(ref.getMap());
                    }
                }}
                reuseMaps
                initialViewState={DEFAULT_VIEW_STATE}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                renderWorldCopies={false}
                maxZoom={10}
                minZoom={6}
                interactiveLayerIds={[...datasets.map(d => `${d.id}-data`), 'spots-points']}
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
                <SpotLayer />
                <GeographicInspector
                    mapRef={mapRef}
                    datasets={datasets.filter(d => d.category === 'sst')}
                    visibleLayers={visibleLayers}
                />
            </Map>
        </div>
    );
};

export default SaltyMap; 