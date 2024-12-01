import type { Region, Dataset, CachedLayerData } from "../types/api";
import type { ISODateString } from "../types/date";
import type { Coordinate } from "../types/core";
import type { MapRef } from 'react-map-gl';

export interface MapState {
  selectedRegion: Region | null;
  selectedDataset: Dataset | null;
  selectedDate: string | null;
  layerData: CachedLayerData | null;
  loading: boolean;
  error: Error | null;
  cursorPosition: Coordinate | null;
  mapRef: MapRef | null;
  ranges: {
    [key: string]: {
      min: number;
      max: number;
      unit?: string;
    };
  } | null;
  isFirstVisit: boolean;
}

export interface MapActions {
  selectRegion: (region: Region | null) => void;
  selectDataset: (dataset: Dataset | null) => void;
  selectDate: (date: string | null) => void;
  fetchLayerData: (dataset: Dataset, date: ISODateString) => Promise<void>;
  setCursorPosition: (position: Coordinate | null) => void;
  setMapRef: (ref: MapRef | null) => void;
}

export type MapStore = MapState & MapActions & {
  initializeFromPreferences: () => boolean;
};
