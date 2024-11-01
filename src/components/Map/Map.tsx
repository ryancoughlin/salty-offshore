import 'mapbox-gl/dist/mapbox-gl.css';
import type { Dataset, Region } from '../../types/api';
import type { ISODateString } from '../../types/date';
import { useEffect, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl';
import Map, { NavigationControl } from 'react-map-gl';
import { MapLayer } from './MapLayer';
import { SpotLayer } from './SpotLayer';
import { DateTimeline } from '../DateTimeline';

interface MapProps {
    region?: Region | null;
    datasets: Dataset[];
    selectedDataset: Dataset | null;
    selectedDate: ISODateString | null;
    onDateSelect: (date: ISODateString) => void;
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
    onDateSelect
}) => {
    const mapRef = useRef<MapRef>(null);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);

    const handleMapLoad = () => {
        setIsStyleLoaded(true);
    };

    useEffect(() => {
        if (isStyleLoaded && region?.bounds && mapRef.current) {
            mapRef.current.fitBounds(region.bounds, {
                padding: 150,
                duration: 1000
            });
        }
    }, [region, isStyleLoaded]);

    console.log('selectedDataset', selectedDataset);
    console.log('region', region);

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
            >
                {isStyleLoaded && (
                    <>
                        <NavigationControl position="top-right" />
                        {region && selectedDataset && (
                            <MapLayer
                                region={region}
                                dataset={selectedDataset}
                                selectedDate={selectedDate || ''}
                            />
                        )}
                        <SpotLayer />
                    </>
                )}
            </Map>

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