import type { Category, LayerType, Bounds } from "./core";
import type { ISODateString } from "./date";
export interface Dataset {
  id: string;
  regionId: string;
  category: Category;
  name: string;
  supportedLayers: LayerType[];
  dates: DateEntry[];
  metadata: DatasetMetadata;
}

export interface DateEntry {
  date: ISODateString;
  layers: {
    [key in LayerType]?: string;
  };
  ranges?: {
    [key: string]: {
      min: number;
      max: number;
      unit?: string;
    };
  };
}

export interface Region {
  id: string;
  name: string;
  description: string;
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
  datasets: Dataset[];
  thumbnail: string;
}

export interface Regions {
  regions: RegionInfo[];
}

export interface CachedLayerData {
  regionId: string;
  datasetId: string;
  date: ISODateString;
  data?: FeatureCollection;
  contours?: FeatureCollection;
  image?: string;
}

export interface DatasetMetadata {
  'cloud-free'?: string;
  frequency?: string;
  resolution?: string;
  description?: string;
  'Dataset URL'?: string;
  [key: string]: string | undefined;
}