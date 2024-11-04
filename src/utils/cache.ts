import type { ISODateString } from "../types/date";

export const createCacheKey = (datasetId: string, date: ISODateString) =>
  `${datasetId}:${date}`;
