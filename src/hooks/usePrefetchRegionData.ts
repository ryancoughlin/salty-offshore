import { useEffect, useRef } from "react";
import { useRegionDatasets } from "./useRegionDatasets";
import useMapStore from "../store/useMapStore";
import type { Region } from "../types/api";

const CHUNK_SIZE = 5;
const DELAY_BETWEEN_CHUNKS = 1000; // 1 second

export const usePrefetchRegionData = (region: Region | null) => {
  const { getRegionData } = useRegionDatasets();
  const { fetchLayerData } = useMapStore();
  const prefetchingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!region || prefetchingRef.current) return;

    const prefetchData = async () => {
      const regionData = getRegionData(region.id);
      if (!regionData) {
        console.warn(`No region data found for region ${region.id}`);
        return;
      }

      prefetchingRef.current = true;
      console.log(`[Prefetch] Starting prefetch for region: ${region.id}`);

      try {
        const prefetchQueue = regionData.datasets.flatMap(dataset => 
          dataset.dates.map(dateEntry => ({
            dataset,
            date: dateEntry.date,
            hasData: Boolean(dateEntry.layers.data),
            hasContours: Boolean(dateEntry.layers.contours),
            hasImage: Boolean(dateEntry.layers.image)
          }))
        );

        console.log(`[Prefetch] Total items to prefetch: ${prefetchQueue.length}`);

        for (let i = 0; i < prefetchQueue.length; i += CHUNK_SIZE) {
          if (abortControllerRef.current?.signal.aborted) {
            console.log('[Prefetch] Prefetch cancelled');
            break;
          }

          const chunk = prefetchQueue.slice(i, i + CHUNK_SIZE);
          
          // Process chunk in parallel
          await Promise.all(
            chunk.map(async ({ dataset, date }) => {
              try {
                await fetchLayerData(dataset, date);
              } catch (error) {
                console.error(
                  `[Prefetch] Error prefetching dataset: ${dataset.id}, ` +
                  `date: ${date}, error:`, error
                );
              }
            })
          );

          // Add delay between chunks unless it's the last chunk
          if (i + CHUNK_SIZE < prefetchQueue.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CHUNKS));
          }
        }

        console.log(`[Prefetch] Completed prefetch for region: ${region.id}`);
      } catch (error) {
        console.error(`[Prefetch] Error:`, error);
      } finally {
        prefetchingRef.current = false;
        abortControllerRef.current = null;
      }
    };

    prefetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      prefetchingRef.current = false;
    };
  }, [region?.id, getRegionData, fetchLayerData]);
};
