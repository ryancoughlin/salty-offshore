# Core Types Documentation

## Region

```typescript
interface Region {
  id: string;
  name: string;
  description: string;
  bounds: Bounds; // [[number, number], [number, number]]
  datasets: Dataset[];
  thumbnail: string;
}
```

## Dataset

```typescript
interface Dataset {
  id: string;
  regionId: string;
  category: Category; // "sst" | "currents" | "chlorophyll"
  name: string;
  supportedLayers: LayerType[];
  dates: DateEntry[];
  metadata: DatasetMetadata;
}
```

## LayerType

```typescript
type BaseLayerType = "image" | "data";
type AdditionalLayerType = "contours";
type LayerType = BaseLayerType | AdditionalLayerType;
```

## DatasetType

```typescript
enum DatasetType {
  BLENDED_SST = "blended_sst",
  LEO_SST = "leo_sst",
  CHLOROPHYLL = "chlorophyll",
  WAVE_HEIGHT = "wave_height",
  CURRENTS = "currents",
}
```

## Coordinate

```typescript
type Coordinate = {
  longitude: number;
  latitude: number;
};
```

## DateEntry

```typescript
interface DateEntry {
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
```

## DatasetMetadata

```typescript
interface DatasetMetadata {
  "cloud-free"?: string;
  frequency?: string;
  resolution?: string;
  description?: string;
  [key: string]: string | undefined;
}
```

These core types form the foundation of the app's data structure and are used throughout the application for:

- Region management
- Dataset handling
- Layer controls
- Map visualization
- Data fetching and caching
- State management
