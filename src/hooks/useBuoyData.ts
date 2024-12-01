import { useState, useEffect } from 'react';

interface BuoyData {
  status: string;
  data: {
    buoy: {
      id: string;
      name: string;
      location: {
        type: string;
        coordinates: [number, number];
      };
    };
    currentConditions: {
      time: string;
      waveHeight: number;
      dominantWavePeriod: number;
      meanWaveDirection: number;
      windSpeed: number | null;
      windDirection: number | null;
      waterTemp: number;
    };
    forecast: Array<{
      date: string;
      summary: {
        waveHeight: {
          min: number;
          max: number;
          avg: number;
        };
        wavePeriod: {
          min: number;
          max: number;
          avg: number;
        };
        windSpeed: {
          min: number;
          max: number;
          avg: number;
        };
      };
      periods: Array<{
        time: string;
        waveHeight: string | number;
        wavePeriod: number;
        waveDirection: number;
        windSpeed: string;
        windDirection: number;
        source?: string;
      }>;
    }>;
    summaries: {
      current: string;
      week: string;
      bestDay: string;
    };
    units: {
      waveHeight: string;
      wavePeriod: string;
      waveDirection: string;
      windSpeed: string;
      windDirection: string;
    };
  };
}

interface CacheEntry {
  data: BuoyData;
  timestamp: number;
}

// Cache constants
const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const BUOY_DATA_CACHE_EXPIRY = TWO_HOURS_MS;
const cache = new Map<string, CacheEntry>();

const fetchBuoyData = async (stationId: string): Promise<BuoyData> => {
  const response = await fetch(`http://localhost:5010/api/buoys/${stationId}`);
  if (!response.ok) throw new Error('Failed to fetch buoy data');
  return response.json();
};

const getCachedData = (stationId: string): BuoyData | null => {
  const entry = cache.get(stationId);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > BUOY_DATA_CACHE_EXPIRY) {
    cache.delete(stationId);
    return null;
  }

  return entry.data;
};

const setCachedData = (stationId: string, data: BuoyData) => {
  cache.set(stationId, {
    data,
    timestamp: Date.now()
  });
};

const useBuoyData = (stationId: string) => {
  const [data, setData] = useState<BuoyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        // Check cache first
        const cachedData = getCachedData(stationId);
        if (cachedData) {
          if (mounted) {
            setData(cachedData);
            setLoading(false);
          }
          return;
        }

        // Fetch fresh data if not in cache
        const freshData = await fetchBuoyData(stationId);
        if (mounted) {
          setData(freshData);
          setCachedData(stationId, freshData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError(null);
    fetchData();

    return () => {
      mounted = false;
    };
  }, [stationId]);

  return { data, loading, error };
};

export default useBuoyData; 