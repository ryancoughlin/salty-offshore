// types/core.ts
export type Coordinate = [number, number]; // [longitude, latitude]
export type Bounds = [[number, number], [number, number]];

// Geographic base types
export interface GeographicEntity {
  id: string;
  name: string;
  bounds: Bounds;
}

// Data classification
export type Category = "sst" | "currents" | "chlorophyll";
export type LayerType = "image" | "data" | "contours";
export type SourceType = "image" | "geojson";
export type LayerStyleType = "raster" | "line";

// Layer foundation
export interface BaseLayer {
  id: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
}

export interface LayerState {
  visible: boolean;
  opacity: number;
}

export interface LayerConfig {
  id: string;
  type: LayerType;
  paint: {
    "raster-opacity"?: number;
    "line-color"?: string;
    "line-width"?: number;
  };
}
