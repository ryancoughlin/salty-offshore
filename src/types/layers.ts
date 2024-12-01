import type { Dataset } from './api';
import { LayerType, isDatasetLayer, isGlobalLayer, isLayerType } from './core';

export interface LayerSettings {
    visible: boolean;
    opacity: number;
}

// Default settings for each layer type
export const DEFAULT_LAYER_SETTINGS: Record<LayerType, LayerSettings> = {
    data: {
        visible: true,
        opacity: 0.7
    },
    image: {
        visible: true,
        opacity: 1.0
    },
    '3d': {
        visible: false,
        opacity: 0.7
    },
    contours: {
        visible: true,
        opacity: 0.7
    },
    grid: {
        visible: false,
        opacity: 0.7
    }
};

// Get available layers for a dataset
export const getAvailableLayers = (dataset: Dataset): LayerType[] => {
    const baseLayers: LayerType[] = ["data", "image"];
    const datasetLayers = dataset.supportedLayers.filter(isDatasetLayer);
    return [...baseLayers, ...datasetLayers];
};

// Get global layers (not tied to datasets)
export const getGlobalLayers = (): LayerType[] => {
    return Object.keys(DEFAULT_LAYER_SETTINGS)
        .filter(isLayerType)
        .filter(isGlobalLayer);
}; 