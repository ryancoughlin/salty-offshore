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
      abortControllerRef.current = new AbortController();

      try {
        // console.log(`[Prefetch] Starting prefetch for region: ${region.id}`);
        // console.log(`[Prefetch] Found ${regionData.datasets.length} datasets`);

        // Create a queue of all dataset-date combinations with metadata
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
        let completedItems = 0;

        for (let i = 0; i < prefetchQueue.length; i += CHUNK_SIZE) {
          // Check if prefetch was cancelled
          if (abortControllerRef.current?.signal.aborted) {
            console.log('[Prefetch] Prefetch cancelled');
            break;
          }

          const chunk = prefetchQueue.slice(i, i + CHUNK_SIZE);
          const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1;
          const totalChunks = Math.ceil(prefetchQueue.length / CHUNK_SIZE);
          
          // console.log(`[Prefetch] Processing chunk ${chunkNumber}/${totalChunks}`);
          
          // Process chunk in parallel
          await Promise.all(
            chunk.map(async ({ dataset, date }) => {
              try {
                await fetchLayerData(dataset, date);
                completedItems++;
                // // console.log(
                // //   `[Prefetch] Completed ${completedItems}/${prefetchQueue.length} ` +
                // //   `(${Math.round((completedItems/prefetchQueue.length) * 100)}%) ` +
                // //   `Dataset: ${dataset.id}, Date: ${date}`
                // );
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
        console.error(`[Prefetch] Fatal error during prefetch:`, error);
      } finally {
        prefetchingRef.current = false;
        abortControllerRef.current = null;
      }
    };

    prefetchData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      prefetchingRef.current = false;
    };
  }, [region?.id, getRegionData, fetchLayerData]);
};
