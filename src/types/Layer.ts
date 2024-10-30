export type LayerCategory = 'sst' | 'currents' | 'chlorophyll';

export type DatasetId = {
  sst: 'LEOACSPOSSTL3SnrtCDaily' | 'other_sst_dataset';
  currents: 'BLENDEDNRTcurrentsDaily' | 'other_currents_dataset';
  chlorophyll: 'chlorophyll_oci' | 'other_chlorophyll_dataset';
}

export interface Layer {
  id: DatasetId[LayerCategory];
  category: LayerCategory;
  name: string;
  visible: boolean;
  opacity: number;
}

export interface LayerGroups {
  sst: Layer[];
  currents: Layer[];
  chlorophyll: Layer[];
}
