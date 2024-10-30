import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLayer } from './MapLayer';
import type { Dataset, Region } from '../../types/api';
import type { DatasetId } from '../../types/Layer';

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
    const viewState = region ? {
        longitude: (region.bounds[0][0] + region.bounds[1][0]) / 2,
        latitude: (region.bounds[0][1] + region.bounds[1][1]) / 2,
        zoom: 7,
    } : DEFAULT_VIEW_STATE;

    return (
        <div className="w-full h-full relative">
            <Map
                reuseMaps
                initialViewState={viewState}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                renderWorldCopies={false}
                maxZoom={12}
                minZoom={3}
            >
                <NavigationControl position="top-right" />
                {region && datasets.map((dataset) => (
                    <MapLayer
                        key={dataset.id}
                        region={region}
                        dataset={dataset}
                        visible={visibleLayers.has(dataset.id)}
                        visibleLayers={visibleLayers}
                        selectedDate={selectedDate}
                    />
                ))}
            </Map>
        </div>
    );
};

export default SaltyMap; 