export type Region = {
  id: string;
  name: string;
  bounds: [number, number, number, number]; // [west, south, east, north]
  center: [number, number];
};

export type DataLayer = {
  id: string;
  name: string;
  visible: boolean;
};

export type TimeRange = {
  start: Date;
  end: Date;
  current: Date;
};

export type MapState = {
  layers: DataLayer[];
};
