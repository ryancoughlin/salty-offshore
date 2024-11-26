import { create } from "zustand";
import type { Dataset, CachedLayerData, Region } from "../types/api";
import type { MapStore } from "./types";
import type { FeatureCollection } from 'geojson';

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

  // Actions
  selectRegion: (region: Region | null) => {
    if (!region) {
      set({ selectedRegion: null, selectedDataset: null, selectedDate: null });
      return;
    }

    console.log('[Region] Selecting region:', region.id);
    console.log('[Region] Available datasets:', region.datasets);

    layerCache.clear();
    set({ selectedRegion: region });
    get().selectDataset(null);
  },

  selectDataset: (dataset: Dataset | null) => {
    const { selectedRegion } = get();

    if (!dataset) {
      console.log('[Dataset] No dataset selected, selecting default LEO dataset');
      console.log('[Dataset] Selected region:', selectedRegion?.id);
      console.log('[Dataset] Region datasets:', selectedRegion?.datasets);

      if (selectedRegion?.datasets) {
        const leoDataset = selectedRegion.datasets.find(
          d => d.id === "LEOACSPOSSTL3SnrtCDaily"
        );
        console.log('[Dataset] Found LEO dataset:', leoDataset?.id);
        if (leoDataset) {
          dataset = leoDataset;
        }
      }
    }

    if (!dataset) {
      set({ selectedDataset: null, selectedDate: null, layerData: null });
      return;
    }

    console.log('[Dataset] Selecting dataset:', dataset.id);
    set({ selectedDataset: dataset, layerData: null });
    
    const mostRecentDate = dataset.dates[0]?.date;
    if (mostRecentDate) {
      console.log('[Dataset] Setting most recent date:', mostRecentDate);
      get().selectDate(mostRecentDate);
    }
  },

  selectDate: (date: string | null) => {
    const { selectedDataset } = get();
    if (!selectedDataset) {
      console.warn('[Date] No dataset selected');
      return;
    }

    if (!date) {
      set({ selectedDate: null, layerData: null });
      return;
    }

    console.log('[Date] Selecting date:', date);
    set({ selectedDate: date, layerData: null });

    const dateEntry = selectedDataset.dates.find(d => d.date === date);
    if (dateEntry?.ranges) {
      set({ ranges: dateEntry.ranges });
    } else {
      set({ ranges: null });
    }

    void get().fetchLayerData(selectedDataset, date);
  },

  fetchLayerData: async (dataset: Dataset, date: string) => {
    const cacheKey = `${dataset.id}:${date}`;
    console.log('[Fetch] Fetching layer data:', { datasetId: dataset.id, date });
    
    const cached = layerCache.get(cacheKey);
    if (cached) {
      console.log('[Fetch] Found cached data');
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
