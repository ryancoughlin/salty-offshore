import { create } from "zustand";
import type { Dataset, CachedLayerData, Region } from "../types/api";
import type { MapStore } from "./types";

const layerCache = new Map<string, CachedLayerData>();
const MAX_CACHE_SIZE = 200;
const PREFETCH_WINDOW = 2;

const fetchLayerUrl = async (url: string | undefined): Promise<any> => {
  if (!url) return null;
  const response = await fetch(url);
  return response.ok ? response.json() : null;
};

export const useMapStore = create<MapStore>((set, get) => ({
  // Initial State
  selectedRegion: null,
  selectedDataset: null,
  selectedDate: null,
  layerData: null,
  loading: false,
  error: null,
  contourLineInfo: null,
  cursorPosition: null,
  mapRef: null,
  ranges: null,

  // Actions
  selectRegion: (region: Region) => {
    if (region.id !== get().selectedRegion?.id) {
      layerCache.clear();
      set({
        selectedRegion: region,
        selectedDataset: null,
        selectedDate: null,
        layerData: null,
        error: null,
      });

      get().selectDefaultDataset(region);
    }
  },

  selectDefaultDataset: (region: Region) => {
    if (!region.datasets) return;

    const sstDataset = region.datasets.find(
      (d: Dataset) => d.id === "LEOACSPOSSTL3SnrtCDaily"
    );

    if (sstDataset) {
      get().selectDataset(sstDataset);
    }
  },

  selectDataset: (dataset: Dataset) => {
    console.log('Selecting dataset:', dataset.id);
    set({ selectedDataset: dataset });
    const mostRecentDate = dataset.dates[0]?.date;
    if (mostRecentDate) {
      get().selectDate(mostRecentDate);
    }
  },

  selectDate: (date) => {
    const { selectedDataset } = get();
    if (!selectedDataset) return;

    set({ selectedDate: date, layerData: null });

    const dateEntry = selectedDataset.dates.find(d => d.date === date);
    if (dateEntry?.ranges) {
      set({ ranges: dateEntry.ranges });
    } else {
      set({ ranges: null });
    }

    get().fetchLayerData(selectedDataset, date);
  },

  fetchLayerData: async (dataset: Dataset, date: string, priority: 'high' | 'low' = 'high') => {
    const cacheKey = `${dataset.id}:${date}`;
    const cached = layerCache.get(cacheKey);

    if (cached) {
      if (priority === 'high') {
        set({ layerData: cached });
      }
      return;
    }

    const isCurrentDataset = dataset.id === get().selectedDataset?.id;
    const isCurrentDate = date === get().selectedDate;
    const shouldUpdateUI = isCurrentDataset && isCurrentDate && priority === 'high';

    if (shouldUpdateUI) {
      set({ loading: true, error: null });
    }

    try {
      const dateEntry = dataset.dates.find((d) => d.date === date);
      if (!dateEntry) throw new Error("Date not found");

      // Parallel fetch all layer types
      const [data, contours] = await Promise.all([
        fetchLayerUrl(dateEntry.layers.data),
        fetchLayerUrl(dateEntry.layers.contours)
      ]);

      const layerData = {
        regionId: dataset.regionId,
        datasetId: dataset.id,
        date,
        data,
        contours,
        image: dateEntry.layers.image,
      };

      // Cache management
      if (layerCache.size >= MAX_CACHE_SIZE) {
        const firstKey = layerCache.keys().next().value;
        layerCache.delete(firstKey);
      }

      layerCache.set(cacheKey, layerData);

      if (shouldUpdateUI) {
        set({ layerData, loading: false });
      }

      // Prefetch adjacent dates
      if (priority === 'high') {
        const dateIndex = dataset.dates.findIndex(d => d.date === date);
        const datesToPrefetch = [
          ...dataset.dates.slice(Math.max(0, dateIndex - PREFETCH_WINDOW), dateIndex),
          ...dataset.dates.slice(dateIndex + 1, dateIndex + 1 + PREFETCH_WINDOW)
        ];

        // Prefetch in background
        Promise.all(
          datesToPrefetch.map(d => 
            get().fetchLayerData(dataset, d.date)
          )
        ).catch(console.error);
      }

    } catch (err) {
      if (shouldUpdateUI) {
        set({
          error: err instanceof Error ? err : new Error("Failed to fetch layer data"),
          loading: false,
        });
      }
      console.error("Error fetching data:", err);
    }
  },

  setCursorPosition: (position) => set({ cursorPosition: position }),
  setMapRef: (ref) => set({ mapRef: ref }),
}));

export default useMapStore;
