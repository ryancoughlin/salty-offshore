import { useEffect, useState } from 'react';
import type { CurrentCollection } from '../types/current.types';
import CurrentsFlowLayer from './CurrentsFlowLayer';
import mapboxgl from 'mapbox-gl';

interface CurrentsLayerProps {
    visible: boolean;
    opacity: number;
    map: mapboxgl.Map | null;
}

const CurrentsLayer = ({ visible, opacity, map }: CurrentsLayerProps) => {
    const [data, setData] = useState<CurrentCollection | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/src/data.geojson');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const geoJSON = await response.json();
                setData(geoJSON);
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        loadData();
    }, []);

    if (!map || !data) return null;

    return (
        <CurrentsFlowLayer 
            map={map} 
            data={data} 
            visible={visible} 
            opacity={opacity} 
        />
    );
};

export default CurrentsLayer;
