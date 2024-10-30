import { BoundingBox, Coordinates } from './common';

export interface Region {
  id: string;
  name: string;
  description?: string;
  bounds: BoundingBox;
  center: Coordinates;
}
