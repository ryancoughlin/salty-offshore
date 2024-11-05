import { create } from "zustand";
import type { Dataset, CachedLayerData } from "../types/api";
import type { MapStore } from "./types";

const layerCache = new Map<string, CachedLayerData>();

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

  // Actions
  selectRegion: (region) => {
    if (region.id !== get().selectedRegion?.id) {
      layerCache.clear();
      set({
        selectedRegion: region,
        selectedDataset: null,
        selectedDate: null,
        layerData: null,
        error: null,
      });
    }
  },

  selectDefaultDataset: (regionData) => {
    const sstDataset = regionData.datasets.find(
      (d) => d.id === "LEOACSPOSSTL3SnrtCDaily"
    );
    if (sstDataset) {
      get().selectDataset(sstDataset);
    }
  },

  selectDataset: (dataset) => {
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
    get().fetchLayerData(selectedDataset, date);
  },

  fetchLayerData: async (dataset, date) => {
    const cacheKey = `${dataset.id}:${date}`;
    const cached = layerCache.get(cacheKey);

    if (cached) {
      set({ layerData: cached });
      return;
    }

    set({ loading: true, error: null });

    try {
      const dateEntry = dataset.dates.find((d) => d.date === date);
      if (!dateEntry) throw new Error("Date not found");

      const [data, contours] = await Promise.all([
        dateEntry.layers.data &&
          fetch(dateEntry.layers.data).then((r) => r.json()),
        dateEntry.layers.contours &&
          fetch(dateEntry.layers.contours).then((r) => r.json()),
      ]);

      const layerData = {
        regionId: dataset.regionId,
        datasetId: dataset.id,
        date,
        data,
        contours,
        image: dateEntry.layers.image,
      };

      layerCache.set(cacheKey, layerData);
      set({ layerData, loading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err : new Error("Failed to fetch layer data"),
        loading: false,
      });
    }
  },

  setContourLineInfo: (info) => set({ contourLineInfo: info }),

  setCursorPosition: (position) => set({ cursorPosition: position }),
  setMapRef: (ref) => set({ mapRef: ref }),
}));

export default useMapStore;
