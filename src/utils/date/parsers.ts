import type { ISODateString } from "../../types/date";

export const parseISODate = (isoString: ISODateString): Date => {
  const year = isoString.slice(0, 4);
  const month = isoString.slice(4, 6);
  const day = isoString.slice(6, 8);
  return new Date(`${year}-${month}-${day}`);
};

export const isValidISODateString = (value: string): value is ISODateString => {
  return /^\d{8}$/.test(value);
};
