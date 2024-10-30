import { DataCategory } from "./core";

export type DatasetId = string;

export interface LayerState {
  id: DatasetId;
  name: string;
  category: DataCategory;
  visible: boolean;
}
