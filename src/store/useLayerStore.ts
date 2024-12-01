import { create } from 'zustand';
import { LayerType, isDatasetLayer, isGlobalLayer } from '../types/core';
import { LayerSettings, DEFAULT_LAYER_SETTINGS } from '../types/layers';

interface LayerState {
    layerSettings: Map<LayerType, LayerSettings>;
    toggleLayer: (layerType: LayerType) => void;
    setLayerOpacity: (layerType: LayerType, opacity: number) => void;
    isLayerAvailable: (layerType: LayerType) => boolean;
    setLayerSettings: (layerType: LayerType, settings: Partial<LayerSettings>) => void;
}

const useLayerStore = create<LayerState>((set) => ({
    layerSettings: new Map(
        Object.entries(DEFAULT_LAYER_SETTINGS) as [LayerType, LayerSettings][]
    ),

    toggleLayer: (layerType) => {
        set((state) => {
            const settings = state.layerSettings.get(layerType);
            if (!settings) return state;

            const newSettings = new Map(state.layerSettings);
            newSettings.set(layerType, {
                ...settings,
                visible: !settings.visible
            });

            return { layerSettings: newSettings };
        });
    },

    setLayerOpacity: (layerType, opacity) => {
        set((state) => {
            const settings = state.layerSettings.get(layerType);
            if (!settings) return state;

            const newSettings = new Map(state.layerSettings);
            newSettings.set(layerType, {
                ...settings,
                opacity
            });

            return { layerSettings: newSettings };
        });
    },

    setLayerSettings: (layerType, settings) => {
        set((state) => {
            const currentSettings = state.layerSettings.get(layerType);
            if (!currentSettings) return state;

            const newSettings = new Map(state.layerSettings);
            newSettings.set(layerType, {
                ...currentSettings,
                ...settings
            });

            return { layerSettings: newSettings };
        });
    },

    isLayerAvailable: (layerType) => {
        return isDatasetLayer(layerType) || isGlobalLayer(layerType);
    }
}));

export { useLayerStore }; 