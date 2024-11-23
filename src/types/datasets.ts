export enum DatasetValueKey {
    BLENDED_SST = 'value',
    LEO_SST = 'value',
    CHLOROPHYLL = 'value',
    WAVE_HEIGHT = 'height',
    CURRENT_VELOCITY = 'current_velocity'
  }
  
  export enum DatasetRangeKey {
    BLENDED_SST = 'analysed_sst',
    LEO_SST = 'sea_surface_temperature',
    CHLOROPHYLL = 'chlor_a',
    WAVE_HEIGHT = 'VHM0',
    CURRENT_VELOCITY = 'current_velocity'
  }
  
  export interface DatasetConfig {
    valueKey: DatasetValueKey;    // Key for getting values from feature properties
    rangeKey: DatasetRangeKey;    // Key for getting ranges from date entry
    unit: string;
    label: string;
    formatValue: (value: number) => string;
    formatRange: (min: number, max: number) => string;
    colorScale: string[];  // Add this field
  }
  
  export const DATASET_CONFIGS: Record<string, DatasetConfig> = {
    'LEOACSPOSSTL3SnrtCDaily': {
      valueKey: DatasetValueKey.LEO_SST,
      rangeKey: DatasetRangeKey.LEO_SST,
      unit: '°',
      label: 'Water temp',
      formatValue: (value: number) => `${value.toFixed(1)}°`,
      formatRange: (min: number, max: number) => `${min.toFixed(1)}° - ${max.toFixed(1)}°`,
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
      valueKey: DatasetValueKey.BLENDED_SST,
      rangeKey: DatasetRangeKey.BLENDED_SST,
      unit: '°',
      label: 'Water temp',
      formatValue: (value: number) => `${value.toFixed(1)}°`,
      formatRange: (min: number, max: number) => `${min.toFixed(1)}° - ${max.toFixed(1)}°`,
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
      valueKey: DatasetValueKey.CHLOROPHYLL,
      rangeKey: DatasetRangeKey.CHLOROPHYLL,
      unit: 'mg/m³',
      label: 'Chlorophyll',
      formatValue: (value: number) => `${value.toFixed(2)} mg/m³`,
      formatRange: (min: number, max: number) => `${min.toFixed(2)} - ${max.toFixed(2)} mg/m³`,
      colorScale: [
        '#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4',
        '#41ae76', '#238b45', '#006d2c', '#00441b'
      ]
    },
    'CMEMS_Global_Waves_Daily': {
        valueKey: DatasetValueKey.WAVE_HEIGHT,
        rangeKey: DatasetRangeKey.WAVE_HEIGHT,
        unit: 'ft',
        label: 'Wave Height',
        formatValue: (value: number) => `${value.toFixed(1)}'`,
        formatRange: (min: number, max: number) => `${min.toFixed(1)} - ${max.toFixed(1)}'`,
        colorScale: [
          '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6',
          '#4292c6', '#2171b5', '#08519c', '#08306b'
        ]
      }
  };
  
  export function getDatasetConfig(datasetId: string): DatasetConfig | undefined {
    return DATASET_CONFIGS[datasetId];
  }
  