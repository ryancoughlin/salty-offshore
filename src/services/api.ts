import { RegionMetadata, DatasetMetadata } from '../types/metadata';

const BASE_URL = 'http://157.245.10.94';

export const api = {
  async getRegionMetadata(regionId: string): Promise<RegionMetadata> {
    const response = await fetch(`${BASE_URL}/${regionId}/metadata.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata for region ${regionId}`);
    }
    return response.json();
  },

  async getDatasetMetadata(regionId: string, datasetId: string): Promise<DatasetMetadata> {
    const metadata = await this.getRegionMetadata(regionId);
    const datasetMetadata = metadata[datasetId];
    if (!datasetMetadata) {
      throw new Error(`Dataset ${datasetId} not found in region ${regionId}`);
    }
    return datasetMetadata;
  },

  getImageUrl(regionId: string, datasetId: string, date: string): string {
    return `${BASE_URL}/${regionId}/${datasetId}/${date}/image.png`;
  },

  getGeoJsonUrl(regionId: string, datasetId: string, date: string): string {
    return `${BASE_URL}/${regionId}/${datasetId}/${date}/contours.geojson`;
  }
};
