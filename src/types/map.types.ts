import type { Map as MapboxMap } from 'mapbox-gl';

export interface MapProps {
    children?: React.ReactNode;
    onClick?: (event: mapboxgl.MapMouseEvent) => void;
}

export interface MapContextProps {
    map: MapboxMap | null;
}

export interface LayerState {
    id: string;
    visible: boolean;
    opacity: number;
}
