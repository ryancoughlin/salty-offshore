export type ISODateString = string;

export interface DatasetDate {
  date: ISODateString;
  processing_time: ISODateString;
}

// Single selected date for all layers
export type SelectedDate = ISODateString | null; 