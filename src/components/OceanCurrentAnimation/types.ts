export interface CurrentAnimationConfig {
  particleCount?: number;
  particleLifespan?: number;
  particleColor?: string;
  fadeOpacity?: boolean;
  speedFactor?: number;
  bounds?: Bounds;
}

export interface CurrentAnimationProps {
  selectedRegion: SelectedRegion;
  map: mapboxgl.Map;
  geoJsonData: GeoJSON.FeatureCollection;
  config?: CurrentAnimationConfig;
}
