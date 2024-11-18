export const CATEGORY_NAMES: Record<string, string> = {
  sst: "Water Temp",
  chlorophyll: "Chlorophyll",
  current: "Ocean Currents",
  salinity: "Salinity",
};

export const DATASET_NAMES: Record<string, string> = {
  LEOACSPOSSTL3SnrtCDaily: "High Res",
  CMEMS_Global_Currents_Daily: "CMEMS Daily",
  chlorophyll_oci: "Chlorophyll",
};

export const getDatasetDisplayName = (datasetId: string): string => {
  return DATASET_NAMES[datasetId] || datasetId;
};
