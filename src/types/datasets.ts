export enum DatasetValueKey {
    BLENDED_SST = 'sea_surface_temperature',
    LEO_SST = 'analysed_sst',
    CHLOROPHYLL = 'chlor_a',
    WAVE_HEIGHT = 'height',
    CURRENT_VELOCITY = 'current_velocity'
  }
  
  export enum DatasetRangeKey {
    SEA_SURFACE_TEMPERATURE = 'sea_surface_temperature',
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
  }
  
  export const DATASET_CONFIGS: Record<string, DatasetConfig> = {
    'LEOACSPOSSTL3SnrtCDaily': {
      valueKey: DatasetValueKey.LEO_SST,
      rangeKey: DatasetRangeKey.SEA_SURFACE_TEMPERATURE,
      unit: '°',
      label: 'Water temp',
      formatValue: (value: number) => `${value.toFixed(1)}°`,
      formatRange: (min: number, max: number) => `${min.toFixed(1)}° - ${max.toFixed(1)}°`
    },
    'BLENDEDsstDNDaily': {
      valueKey: DatasetValueKey.BLENDED_SST,
      rangeKey: DatasetRangeKey.SEA_SURFACE_TEMPERATURE,
      unit: '°',
      label: 'Water temp',
      formatValue: (value: number) => `${value.toFixed(1)}°`,
      formatRange: (min: number, max: number) => `${min.toFixed(1)}° - ${max.toFixed(1)}°`
    },
    'chlorophyll_oci': {
      valueKey: DatasetValueKey.CHLOROPHYLL,
      rangeKey: DatasetRangeKey.CHLOROPHYLL,
      unit: 'mg/m³',
      label: 'Chlorophyll',
      formatValue: (value: number) => `${value.toFixed(2)} mg/m³`,
      formatRange: (min: number, max: number) => `${min.toFixed(2)} - ${max.toFixed(2)} mg/m³`
    },
    'CMEMS_Global_Waves_Daily': {
        valueKey: DatasetValueKey.WAVE_HEIGHT,
        rangeKey: DatasetRangeKey.WAVE_HEIGHT,
        unit: 'ft',
        label: 'Wave Height',
        formatValue: (value: number) => `${value.toFixed(2)}'`,
        formatRange: (min: number, max: number) => `${min.toFixed(2)} - ${max.toFixed(2)}'`
      }
  };
  
  export function getDatasetConfig(datasetId: string): DatasetConfig | undefined {
    return DATASET_CONFIGS[datasetId];
  }
  