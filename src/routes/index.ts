export const ROUTES = {
  HOME: '/',
  REGION: ':regionId',
  DATASET: ':regionId/:datasetId',
  DATE: ':regionId/:datasetId/:date'
} as const;

// Type-safe route params
export interface RouteParams {
  regionId?: string;
  datasetId?: string;
  date?: string;
}

// Helper to build URLs
export const buildUrl = {
  region: (regionId: string) => `/${regionId}`,
  dataset: (regionId: string, datasetId: string) => `/${regionId}/${datasetId}`,
  date: (regionId: string, datasetId: string, date: string) => 
    `/${regionId}/${datasetId}/${date}`
}; 