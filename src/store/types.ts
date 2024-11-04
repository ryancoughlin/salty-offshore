import type { RegionInfo, Dataset, CachedLayerData } from "../types/api";
import type { ISODateString } from "../types/date";

export interface MapState {
  selectedRegion: RegionInfo | null;
  selectedDataset: Dataset | null;
  selectedDate: ISODateString | null;
  layerData: CachedLayerData | null;
  loading: boolean;
  error: Error | null;
}

export interface MapActions {
  selectRegion: (region: RegionInfo) => void;
  selectDefaultDataset: (regionData: RegionInfo) => void;
  selectDataset: (dataset: Dataset) => void;
  selectDate: (date: ISODateString) => void;
  fetchLayerData: (dataset: Dataset, date: ISODateString) => Promise<void>;
}

export type MapStore = MapState & MapActions;
