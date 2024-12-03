import { create } from "zustand";
import type { Dataset, CachedLayerData, Region } from "../types/api";
import type { MapStore } from "./types";
import type { FeatureCollection } from 'geojson';
import { getUserPreference, setUserPreference } from '../utils/preferences';

const layerCache = new Map<string, CachedLayerData>();

const MAX_CACHE_SIZE = 500;

const fetchLayerUrl = async (url: string | undefined): Promise<FeatureCollection | null> => {
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
  cursorPosition: null,
  mapRef: null,
  ranges: null,
  isFirstVisit: true,

  // Actions
  initializeFromPreferences: () => {
    const lastRegion = getUserPreference('last_selected_region');
    if (!lastRegion) {
      set({ isFirstVisit: true });
      return false;
    }

    try {
      const region = JSON.parse(lastRegion);
      get().selectRegion(region);
      set({ isFirstVisit: false });
      return true;
    } catch {
      set({ isFirstVisit: true });
      return false;
    }
  },

  selectRegion: (region: Region | null) => {
    if (!region) {
      set({ selectedRegion: null, selectedDataset: null, selectedDate: null });
      return;
    }

    // Save to user preferences
    setUserPreference('last_selected_region', JSON.stringify(region));

    // Clear cache and update state atomically
    layerCache.clear();
    set({
      selectedRegion: region,
      selectedDataset: null,
      selectedDate: null,
      layerData: null
    });

    // After state is set, select default dataset
    if (region.datasets) {
      const defaultDataset = region.datasets.find(d => d.id === "LEOACSPOSSTL3SnrtCDaily");
      if (defaultDataset) {
        get().selectDataset(defaultDataset);
      }
    }
  },

  selectDataset: (dataset: Dataset | null) => {
    if (!dataset) {
      set({ selectedDataset: null, selectedDate: null, layerData: null, ranges: null });
      return;
    }

    // Batch state updates
    const mostRecentDate = dataset.dates[0]?.date;
    const dateEntry = mostRecentDate ? dataset.dates[0] : null;

    set({
      selectedDataset: dataset,
      selectedDate: mostRecentDate || null,
      layerData: null,
      ranges: dateEntry?.ranges || null
    });

    if (mostRecentDate) {
      void get().fetchLayerData(dataset, mostRecentDate);
    }
  },

  selectDate: (date: string | null) => {
    const { selectedDataset } = get();

    if (!selectedDataset) return;

    if (!date) {
      set({ selectedDate: null, layerData: null, ranges: null });
      return;
    }

    // Update state atomically
    const dateEntry = selectedDataset.dates.find(d => d.date === date);
    set({
      selectedDate: date,
      layerData: null,
      ranges: dateEntry?.ranges || null
    });

    // Fetch layer data after state update
    void get().fetchLayerData(selectedDataset, date);
  },

  fetchLayerData: async (dataset: Dataset, date: string) => {
    const cacheKey = `${dataset.id}:${date}`;
    const cached = layerCache.get(cacheKey);

    if (cached) {
      if (dataset.id === get().selectedDataset?.id && date === get().selectedDate) {
        set({ layerData: cached });
      }
      return;
    }

    const isCurrentDataset = dataset.id === get().selectedDataset?.id;
    const isCurrentDate = date === get().selectedDate;
    const shouldUpdateUI = isCurrentDataset && isCurrentDate;

    if (shouldUpdateUI) {
      set({ loading: true, error: null });
    }

    try {
      const dateEntry = dataset.dates.find((d) => d.date === date);
      if (!dateEntry) {
        throw new Error(`Date ${date} not found in dataset ${dataset.id}`);
      }

      const [data, contours] = await Promise.all([
        fetchLayerUrl(dateEntry.layers.data),
        fetchLayerUrl(dateEntry.layers.contours)
      ]);

      const layerData: CachedLayerData = {
        regionId: dataset.regionId,
        datasetId: dataset.id,
        date,
        data: data || null,
        contours: contours || null,
        image: dateEntry.layers.image || null
      };

      if (layerCache.size >= MAX_CACHE_SIZE) {
        const firstKey = layerCache.keys().next().value;
        layerCache.delete(firstKey);
      }

      layerCache.set(cacheKey, layerData);

      if (shouldUpdateUI) {
        set({ layerData, loading: false });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch layer data");
      console.error('[Fetch] Error:', error);
      if (shouldUpdateUI) {
        set({ error, loading: false });
      }
    }
  },

  setCursorPosition: (position) => set({ cursorPosition: position }),
  setMapRef: (ref) => set({ mapRef: ref }),
}));

export default useMapStore;
