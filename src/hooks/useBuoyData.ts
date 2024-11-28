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

const useBuoyData = (stationId: string) => {
  const [data, setData] = useState<BuoyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5010/api/buoys/${stationId}`);
        if (!response.ok) throw new Error('Failed to fetch buoy data');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId]);

  return { data, loading, error };
};

export default useBuoyData; 