import { useState, useEffect } from 'react';

interface StationData {
    status: string;
    data: {
        station: {
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
    data: StationData;
    timestamp: number;
}

// Cache constants
const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const STATION_DATA_CACHE_EXPIRY = TWO_HOURS_MS;
const cache = new Map<string, CacheEntry>();

const fetchStationData = async (stationId: string): Promise<StationData> => {
    const response = await fetch(`http://localhost:5010/api/buoys/${stationId}`);
    if (!response.ok) throw new Error('Failed to fetch station data');
    return response.json();
};

const getCachedData = (stationId: string): StationData | null => {
    const entry = cache.get(stationId);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > STATION_DATA_CACHE_EXPIRY) {
        cache.delete(stationId);
        return null;
    }

    return entry.data;
};

const setCachedData = (stationId: string, data: StationData) => {
    cache.set(stationId, {
        data,
        timestamp: Date.now()
    });
};

const useStationData = (stationId: string) => {
    const [data, setData] = useState<StationData | null>(null);
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
                const freshData = await fetchStationData(stationId);
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

export default useStationData; 