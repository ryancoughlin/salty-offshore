// GeoJSON types for ocean currents
export interface CurrentProperties {
  u: number; // eastward velocity component
  v: number; // northward velocity component
  velocity: number; // total velocity magnitude
  direction: number; // current direction in degrees
  depth: number; // depth of measurement
}

export interface CurrentFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: CurrentProperties;
}

export interface CurrentCollection {
  type: "FeatureCollection";
  features: CurrentFeature[];
}
