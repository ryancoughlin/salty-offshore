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

// Base layers that come with every dataset
export type BaseLayerType = "image" | "data";

// Additional layers that can be toggled
export type AdditionalLayerType = "contours";

// Combined type for all possible layers
export type LayerType = BaseLayerType | AdditionalLayerType;

// Base layers are always present
export const BASE_LAYERS: BaseLayerType[] = ["image", "data"];

// Helper to check if a layer is an additional layer
export const isAdditionalLayer = (
  layer: LayerType
): layer is AdditionalLayerType => {
  return !BASE_LAYERS.includes(layer as BaseLayerType);
};

// Layer foundation
export interface BaseLayer {
  id: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
}
