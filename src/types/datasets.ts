export enum DatasetRangeKey {
  SEA_SURFACE_TEMPERATURE = 'sea_surface_temperature',
  WAVE_HEIGHT = 'VHM0',
  CHLOROPHYLL = 'chlor_a',
  CURRENT_VELOCITY = 'current_velocity'
}

export enum DatasetDisplayNames {
  SEA_SURFACE_TEMPERATURE = 'Sea Surface Temperature',
  WAVE_HEIGHT = 'Wave Height',
  CHLOROPHYLL = 'Chlorophyll',
  CURRENT_VELOCITY = 'Current Velocity'
}

export interface DatasetRange {
  min: number;
  max: number;
}

export interface DatasetConfig {
  key: DatasetRangeKey;
  displayName: DatasetDisplayNames;
  unit: string;
  formatValue: (value: number) => string;
}

export const DATASET_CONFIGS: Record<DatasetRangeKey, DatasetConfig> = {
  [DatasetRangeKey.SEA_SURFACE_TEMPERATURE]: {
    key: DatasetRangeKey.SEA_SURFACE_TEMPERATURE,
    displayName: DatasetDisplayNames.SEA_SURFACE_TEMPERATURE,
    unit: '°C',
    formatValue: (value: number) => `${value.toFixed(1)}°C`
  },
  [DatasetRangeKey.WAVE_HEIGHT]: {
    key: DatasetRangeKey.WAVE_HEIGHT,
    displayName: DatasetDisplayNames.WAVE_HEIGHT,
    unit: 'm',
    formatValue: (value: number) => `${value.toFixed(1)}m`
  },
  [DatasetRangeKey.CHLOROPHYLL]: {
    key: DatasetRangeKey.CHLOROPHYLL,
    displayName: DatasetDisplayNames.CHLOROPHYLL,
    unit: 'mg/m³',
    formatValue: (value: number) => `${value.toFixed(2)} mg/m³`
  },
  [DatasetRangeKey.CURRENT_VELOCITY]: {
    key: DatasetRangeKey.CURRENT_VELOCITY,
    displayName: DatasetDisplayNames.CURRENT_VELOCITY,
    unit: 'm/s',
    formatValue: (value: number) => `${value.toFixed(1)} m/s`
  }
};

export function getDatasetConfig(key: DatasetRangeKey): DatasetConfig {
  const config = DATASET_CONFIGS[key];
  if (!config) {
    throw new Error(`No configuration found for dataset key: ${key}`);
  }
  return config;
}

export function getDatasetValue(feature: GeoJSON.Feature, datasetKey: DatasetRangeKey): number | null {
  const value = feature.properties?.[datasetKey];
  return typeof value === 'number' && isFinite(value) ? value : null;
} 