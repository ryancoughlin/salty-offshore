import type { Region } from "../types/Region";

export const AVAILABLE_REGIONS: Region[] = [
  {
    id: "cape_cod",
    name: "Cape Cod and Georges Bank",
    description: "Cape Cod and Georges Bank region",
    bounds: [
      [-71.25, 39.5],  // [west, south]
      [-65.25, 43.5]   // [east, north]
    ]
  },
  {
    id: "canyons_overview",
    name: "NE Canyons Overview",
    description: "Satfish overview of Northeast US submarine canyons",
    bounds: [
      [-77.0, 36.0],   // [west, south]
      [-65.0, 42.0]    // [east, north]
    ]
  }
];
