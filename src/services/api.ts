const BASE_PATH = '/api';

export const api = {
  async getRegionData(regionId: string) {
    const response = await fetch(`${BASE_PATH}/regions/${regionId}/index.json`);
    if (!response.ok) throw new Error('Failed to fetch region data');
    return response.json();
  },

  async getDatasetInfo(regionId: string, datasetId: string) {
    const response = await fetch(
      `${BASE_PATH}/regions/${regionId}/datasets/${datasetId}/index.json`
    );
    if (!response.ok) throw new Error('Failed to fetch dataset info');
    return response.json();
  },

  getImageUrl(path: string) {
    return `${BASE_PATH}/regions/${path}`;
  },

  getGeoJsonUrl(path: string) {
    return `${BASE_PATH}/regions/${path}`;
  }
};
