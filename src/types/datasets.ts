import type { LayerType } from './core';

export enum DatasetType {
    BLENDED_SST = 'blended_sst',
    LEO_SST = 'leo_sst',
    CHLOROPHYLL = 'chlorophyll',
    WAVE_HEIGHT = 'wave_height',
    CURRENTS = 'currents'
}

export interface DatasetConfig {
    valueKey: string;
    rangeKey: string;
    unit: string;
    label: string;
    supportedLayers: LayerType[];
    colorScale: string[];
}

export const DATASET_CONFIGS: Record<string, DatasetConfig> = {
    'LEOACSPOSSTL3SnrtCDaily': {
        valueKey: 'temperature',
        rangeKey: 'temperature',
        unit: '°',
        label: 'Water temp',
        supportedLayers: ['data', 'image', 'contours'],
        colorScale: [
            '#081d58', '#0d2167', '#122b76', '#173584', '#1c3f93',
            '#2149a1', '#2653b0', '#2b5dbe', '#3067cd', '#3571db',
            '#3a7bea', '#4185f8', '#41b6c4', '#46c0cd', '#4bcad6',
            '#50d4df', '#55dde8', '#5ae7f1', '#7fcdbb', '#8ed7c4',
            '#9de1cd', '#acebd6', '#bbf5df', '#c7e9b4', '#d6edb8',
            '#e5f1bc', '#f4f5c0', '#fef396', '#fec44f', '#fdb347',
            '#fca23f', '#fb9137', '#fa802f', '#f96f27', '#f85e1f',
            '#f74d17'
        ]
    },
    'BLENDEDsstDNDaily': {
        valueKey: 'temperature',
        rangeKey: 'temperature',
        unit: '°',
        label: 'Water temp',
        supportedLayers: ['data', 'image', 'contours'],
        colorScale: [
            '#081d58', '#0d2167', '#122b76', '#173584', '#1c3f93',
            '#2149a1', '#2653b0', '#2b5dbe', '#3067cd', '#3571db',
            '#3a7bea', '#4185f8', '#41b6c4', '#46c0cd', '#4bcad6',
            '#50d4df', '#55dde8', '#5ae7f1', '#7fcdbb', '#8ed7c4',
            '#9de1cd', '#acebd6', '#bbf5df', '#c7e9b4', '#d6edb8',
            '#e5f1bc', '#f4f5c0', '#fef396', '#fec44f', '#fdb347',
            '#fca23f', '#fb9137', '#fa802f', '#f96f27', '#f85e1f',
            '#f74d17'
        ]
    },
    'chlorophyll_oci': {
        valueKey: 'concentration',
        rangeKey: 'concentration',
        unit: 'mg/m³',
        label: 'Chlorophyll',
        supportedLayers: ['data', 'image', 'contours'],
        colorScale: [
            '#B1C2D8', '#A3B9D3', '#96B1CF', '#88A8CA', '#7AA0C5',
            '#6C98C0', '#5F8FBB', '#5187B6', '#437FB0', '#3577AB',
            '#2EAB87', '#37B993', '#40C79F', '#49D5AB', '#52E3B7',
            '#63E8B8', '#75EDB9', '#86F3BA', '#98F8BB', '#A9FDBB',
            '#C1F5A3', '#DAFD8B', '#F2FF73', '#FFF75B', '#FFE742',
            '#FFD629', '#FFC611', '#FFB600', '#FFA500', '#FF9400',
            '#FF8300', '#FF7200', '#FF6100', '#FF5000', '#FF3F00'
        ]
    },
    'CMEMS_Global_Waves_Daily': {
        valueKey: 'height',
        rangeKey: 'height',
        unit: 'ft',
        label: 'Wave Height',
        supportedLayers: ['data', 'image', '3d',],
        colorScale: [
            '#053061', '#0a3666', '#0f3d6c',
            '#B2E5F4', '#bae7f3', '#c1e9f2',
            '#c6dbef', '#cdddf0', '#d3dff1',
            '#d9e6f2', '#e0e9f3', '#e7ecf4',
            '#e5eef4', '#edf1f6', '#f0f5f7',
            '#f2f2f1', '#f3efeb', '#f5ebe6',
            '#f4e7df', '#f3e3d9', '#f3e0d4',
            '#f2d9c8', '#f1d1bc', '#f0c5ac',
            '#ecb399', '#e8a086', '#e48d73',
            '#dd7960', '#d66552', '#d15043',
            '#cb3e36', '#c52828', '#bf1f1f',
            '#b81717', '#b01010', '#a80808'
        ]
    },
    'CMEMS_Global_Currents_Daily': {
        valueKey: 'speed',
        rangeKey: 'speed',
        unit: 'm/s',
        label: 'Current',
        supportedLayers: ['data', 'image'],
        colorScale: ['#B1C2D8', '#89CFF0', '#4682B4', '#0047AB', '#00008B', '#000033']
    }
};

export function getDatasetConfig(datasetId: string): DatasetConfig | undefined {
    return DATASET_CONFIGS[datasetId];
}

export function getDatasetType(datasetId: string): DatasetType | undefined {
    switch (datasetId) {
        case 'LEOACSPOSSTL3SnrtCDaily':
            return DatasetType.LEO_SST;
        case 'BLENDEDsstDNDaily':
            return DatasetType.BLENDED_SST;
        case 'chlorophyll_oci':
            return DatasetType.CHLOROPHYLL;
        case 'CMEMS_Global_Waves_Daily':
            return DatasetType.WAVE_HEIGHT;
        case 'CMEMS_Global_Currents_Daily':
            return DatasetType.CURRENTS;
        default:
            return undefined;
    }
}

// Helper to get supported layers for a dataset
export function getSupportedLayers(datasetId: string): LayerType[] {
    const config = getDatasetConfig(datasetId);
    return config?.supportedLayers ?? ['data', 'image'];
}
