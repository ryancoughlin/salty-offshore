export type LayerCategory = 'sst' | 'currents' | 'chlorophyll';

export type SSTDataset = 'LEOACSPOSSTL3SnrtCDaily' | 'other_sst_dataset';
export type CurrentsDataset = 'BLENDEDNRTcurrentsDaily' | 'other_currents_dataset';
export type ChlorophyllDataset = 'chlorophyll_oci' | 'other_chlorophyll_dataset';

export type DatasetId = SSTDataset | CurrentsDataset | ChlorophyllDataset;

export interface Layer {
  id: DatasetId;
  category: LayerCategory;
  name: string;
  visible: boolean;
}

// Example grouping of layers by category
export interface LayerGroups {
  sst: Layer[];
  currents: Layer[];
  chlorophyll: Layer[];
}
