export type Region = {
  id: string;
  name: string;
  description: string;
  bounds: [[number, number], [number, number]]; // [west, south], [east, north]
};
