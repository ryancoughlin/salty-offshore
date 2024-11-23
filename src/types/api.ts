import type { Category, LayerType, Bounds } from "./core";
import type { ISODateString } from "./date";
import type { FeatureCollection } from 'geojson';

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
  thumbnail: string;
}

export interface APIResponse {
  regions: Region[];
  lastUpdated: string;
}

export interface Regions {
  regions: Region[];
}

export interface LayerData {
  data: FeatureCollection | null;
  contours: FeatureCollection | null;
  image: string | null;
}

export interface CachedLayerData {
  regionId: string;
  datasetId: string;
  date: string;
  data: FeatureCollection | null;
  contours: FeatureCollection | null;
  image: string | null;
}

export interface DatasetMetadata {
  'cloud-free'?: string;
  frequency?: string;
  resolution?: string;
  description?: string;
  [key: string]: string | undefined;
}