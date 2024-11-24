import type { Region, Dataset, CachedLayerData } from "../types/api";
import type { ISODateString } from "../types/date";
import type { Coordinate } from "../types/core";
import type { Map as MapboxMap } from "mapbox-gl";

export interface MapState {
  selectedRegion: Region | null;
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
  selectRegion: (region: Region) => void;
  selectDefaultDataset: (regionData: Region) => void;
  selectDataset: (dataset: Dataset) => void;
  selectDate: (date: ISODateString) => void;
  fetchLayerData: (dataset: Dataset, date: ISODateString) => Promise<void>;
  setCursorPosition: (position: Coordinate | null) => void;
  setMapRef: (ref: MapboxMap | null) => void;
}

export type MapStore = MapState & MapActions;
