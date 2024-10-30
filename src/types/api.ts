import { DataCategory, LayerType, Bounds } from "./core";

export interface Dataset {
  id: string;
  category: DataCategory;
  name: string;
  supportedLayers: LayerType[];
  dates: DateEntry[];
}

export interface DateEntry {
  date: string;
  layers: {
    [key in LayerType]?: string;
  };
}

export interface Region {
  id: string;
  name: string;
  bounds: Bounds;
  datasets: Dataset[];
}

export interface APIResponse {
  regions: Region[];
  lastUpdated: string;
}

export interface RegionInfo {
  id: string;
  name: string;
  description: string;
  bounds: Bounds;
}

export interface Regions {
  regions: RegionInfo[];
}
