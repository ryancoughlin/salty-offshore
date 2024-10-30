import type { Map as MapboxMap } from 'mapbox-gl';
import { Layer } from './Layer';

export interface MapState {
  layers: Layer[];
}

export interface MapProps {
  children?: React.ReactNode;
  onClick?: (event: mapboxgl.MapMouseEvent) => void;
}

export interface MapContextProps {
  map: MapboxMap | null;
} 