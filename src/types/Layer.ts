import { Category } from "./core";

export type DatasetId = string;

export interface LayerState {
  id: DatasetId;
  name: string;
  category: Category;
  visible: boolean;
}
