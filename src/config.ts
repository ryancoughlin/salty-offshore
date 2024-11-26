export const CATEGORY_NAMES: Record<string, string> = {
  sst: "Water Temp",
  waves: "Wave Height",
  chlorophyll: "Chlorophyll",
  current: "Ocean Currents",
  salinity: "Salinity",
};

export const DATASET_NAMES: Record<string, string> = {
  "LEOACSPOSSTL3SnrtCDaily": "High Res",
  "BLENDEDsstDNDaily": "Blended (Gap-free)",
  "CMEMS_Global_Currents_Daily": "Currents",
  "chlorophyll_oci": "Chlorophyll",
  "CMEMS_Global_Waves_Daily": "Wave Height"
};

export const getDatasetDisplayName = (datasetId: string): string => {
  return DATASET_NAMES[datasetId] || datasetId;
};
