// types/core.ts

export type Coordinate = {
  longitude: number;
  latitude: number;
};
export type Bounds = [[number, number], [number, number]];

// Data classification
export type Category = "sst" | "currents" | "chlorophyll";

// Base layers that come with every dataset
export type BaseLayerType = "data" | "image";

// Additional layers that can be toggled per dataset
export type DatasetLayerType = "3d" | "contours";

// Global layers (not tied to datasets)
export type GlobalLayerType = "grid";

// Combined type for all possible layers
export type LayerType = BaseLayerType | DatasetLayerType | GlobalLayerType;

// Base layers are always present
export const BASE_LAYERS: BaseLayerType[] = ["data", "image"];

// Type guard for LayerType
export const isLayerType = (value: string): value is LayerType => {
  return [...BASE_LAYERS, "3d", "contours", "grid"].includes(value as LayerType);
};

// Helper to check if a layer is a dataset-specific layer
export const isDatasetLayer = (
  layer: LayerType | string
): layer is DatasetLayerType => {
  return ["3d", "contours"].includes(layer as DatasetLayerType);
};

// Helper to check if a layer is a global layer
export const isGlobalLayer = (
  layer: LayerType | string
): layer is GlobalLayerType => {
  return layer === "grid";
};

// Layer foundation
export interface BaseLayer {
  id: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
}
