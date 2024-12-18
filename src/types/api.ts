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
  thumbnail?: string;
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

export interface LayerData {
  id: string;
  type: string;
  source: string;
  paint?: {
    'fill-color'?: string;
    'fill-opacity'?: number;
    'line-color'?: string;
    'line-width'?: number;
    [key: string]: string | number | undefined;
  };
  layout?: {
    visibility?: 'visible' | 'none';
    [key: string]: string | undefined;
  };
}