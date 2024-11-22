import type { RegionInfo, Dataset, CachedLayerData } from "../types/api";
import type { ISODateString } from "../types/date";
import type { Coordinate } from "../types/core";
import type { Map as MapboxMap } from "mapbox-gl";

export interface MapState {
  selectedRegion: RegionInfo | null;
  selectedDataset: Dataset | null;
  selectedDate: ISODateString | null;
  layerData: CachedLayerData | null;
  loading: boolean;
  error: Error | null;
  cursorPosition: Coordinate | null;
  mapRef: MapboxMap | null;
  ranges: {
    [key: string]: {
      min: number;
      max: number;
      unit?: string;
    };
  } | null;
}

export interface MapActions {
  selectRegion: (region: RegionInfo) => void;
  selectDefaultDataset: (regionData: RegionInfo) => void;
  selectDataset: (dataset: Dataset) => void;
  selectDate: (date: ISODateString) => void;
  fetchLayerData: (dataset: Dataset, date: ISODateString) => Promise<void>;
  setCursorPosition: (position: Coordinate | null) => void;
  setMapRef: (ref: MapboxMap | null) => void;
}

export type MapStore = MapState & MapActions;
