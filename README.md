# Salty Offshore

A modern marine weather visualization application built with React, TypeScript, and Mapbox GL JS. This application provides real-time and forecast marine weather conditions from various oceanographic data sources.

## Features

- Interactive map interface with buoy station markers
- Real-time marine conditions including:
  - Wave height and period
  - Wind speed and direction
  - Water temperature
- 7-day marine weather forecasts
- Station-specific detailed information

## Data Sources

### NDBC Buoys

- Provider: National Data Buoy Center (NDBC)
- Updates: Hourly
- Data includes:
  - Wave height and period
  - Wind speed and direction
  - Water temperature

### Marine Weather Forecasts

- Provider: NOAA/NWS
- Updates: Every 6 hours (00z, 06z, 12z, 18z)
- Forecast length: 7 days
- Resolution: 3-hour intervals

## API Endpoints

### Buoy Stations

```
GET /api/buoys
```

Returns a list of all available buoy stations with their metadata.

### Station Data

```
GET /api/buoys/:stationId
```

Returns detailed information for a specific station including:

- Current conditions
- 7-day forecast
- Summary statistics

Response includes:

```typescript
{
  status: string;
  data: {
    buoy: {
      id: string;
      name: string;
      location: {
        type: string;
        coordinates: [number, number];
      }
    }
    currentConditions: {
      time: string;
      waveHeight: number;
      dominantWavePeriod: number;
      meanWaveDirection: number;
      windSpeed: number | null;
      windDirection: number | null;
      waterTemp: number;
    }
    forecast: Array<{
      date: string;
      summary: {
        waveHeight: { min: number; max: number; avg: number };
        wavePeriod: { min: number; max: number; avg: number };
        windSpeed: { min: number; max: number; avg: number };
      };
      periods: Array<{
        time: string;
        waveHeight: string | number;
        wavePeriod: number;
        waveDirection: number;
        windSpeed: string;
        windDirection: number;
      }>;
    }>;
    summaries: {
      current: string;
      week: string;
      bestDay: string;
    }
    units: {
      waveHeight: string;
      wavePeriod: string;
      waveDirection: string;
      windSpeed: string;
      windDirection: string;
    }
  }
}
```

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

## Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Vite](https://vitejs.dev/) - Build Tool
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) - Map Visualization
- [TailwindCSS](https://tailwindcss.com/) - Styling

## License

This project is licensed under the MIT License - see the LICENSE file for details
