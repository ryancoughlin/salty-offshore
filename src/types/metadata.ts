import { LayerCategory } from './Layer';

export interface LayerMetadata {
  image?: string;
  geojson?: string;
}

export interface DateEntry {
  date: string;
  processing_time: string;
  layers: LayerMetadata;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  type: LayerCategory;
  supportedLayers: Array<'image' | 'geojson'>;
  dates: DateEntry[];
}

export interface RegionMetadata {
  [datasetId: string]: DatasetMetadata;
} 