import { RegionData } from "../types/Region";

const BASE_URL = "http://157.245.10.94";

export const api = {
  async getRegionData(regionId: string): Promise<RegionData> {
    const response = await fetch(`${BASE_URL}/${regionId}/data.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for region ${regionId}`);
    }
    return response.json();
  },
};
