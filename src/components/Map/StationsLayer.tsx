import { useMemo, useState, useEffect } from 'react';
import { Layer, Source, useMap } from 'react-map-gl';
import type { FeatureCollection, Feature, Point } from 'geojson';
import type { CircleLayer, SymbolLayer, MapLayerMouseEvent } from 'mapbox-gl';
import stations from '../../utils/stations.json';
import { StationPanel } from '../StationPanel';
import BuoyHoverCard from './StationHoverCard';
import buoyIcon from '../../assets/buoy.png';

interface Station {
  id: string;
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  type: string;
  hasRealTimeData: boolean;
  owner: string;
}

interface HoverInfo {
  station: Station;
  x: number;
  y: number;
}

const StationsLayer = () => {
  const { current: map } = useMap();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<HoverInfo | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const geojsonData: FeatureCollection<Point> = useMemo(() => ({
    type: 'FeatureCollection',
    features: stations.map(station => ({
      type: 'Feature',
      geometry: {
        type: 'Point' as const,
        coordinates: station.location.coordinates as [number, number]
      },
      properties: {
        id: station.id,
        name: station.name,
        type: station.type,
        hasRealTimeData: station.hasRealTimeData,
        owner: station.owner
      }
    })) as Feature<Point>[]
  }), []);

  useEffect(() => {
    if (!map) return;

    if (map.hasImage('buoy-icon')) {
      setIsImageLoaded(true);
      return;
    }

    const image = new Image();
    image.src = buoyIcon;
    image.onload = () => {
      if (map.hasImage('buoy-icon')) {
        map.removeImage('buoy-icon');
      }
      map.addImage('buoy-icon', image);
      setIsImageLoaded(true);
    };

    return () => {
      if (map.hasImage('buoy-icon')) {
        map.removeImage('buoy-icon');
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const handleClusterClick = (e: MapLayerMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });

      const clusterId = features[0]?.properties?.cluster_id;
      if (!clusterId) return;

      const mapboxSource = map.getSource('stations');
      if (!mapboxSource || !('getClusterExpansionZoom' in mapboxSource)) return;

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || !zoom) return;

        map.easeTo({
          center: (features[0].geometry as Point).coordinates as [number, number],
          zoom: zoom + 1
        });
      });
    };

    const handleStationClick = (e: MapLayerMouseEvent) => {
      e.preventDefault();
      const feature = e.features?.[0];
      if (!feature?.properties) return;

      const station = stations.find(s => s.id === feature.properties?.id);
      if (station) {
        setSelectedStation({
          ...station,
          location: {
            type: "Point",
            coordinates: station.location.coordinates as [number, number]
          }
        });
      }
    };

    const handleStationHover = (e: MapLayerMouseEvent) => {
      e.preventDefault();
      const feature = e.features?.[0];
      if (!feature?.properties) return;

      const station = stations.find(s => s.id === feature.properties?.id);
      if (station) {
        setHoveredStation({
          station: {
            ...station,
            location: {
              type: "Point",
              coordinates: station.location.coordinates as [number, number]
            }
          },
          x: e.point.x,
          y: e.point.y
        });
        map.getCanvas().style.cursor = 'pointer';
      }
    };

    const handleStationLeave = () => {
      setHoveredStation(null);
      map.getCanvas().style.cursor = '';
    };

    // Add event listeners
    map.on('click', 'clusters', handleClusterClick);
    map.on('click', 'unclustered-point', handleStationClick);

    // Unclustered point interactions
    map.on('mouseenter', 'unclustered-point', handleStationHover);
    map.on('mousemove', 'unclustered-point', handleStationHover);
    map.on('mouseleave', 'unclustered-point', handleStationLeave);

    return () => {
      // Remove event listeners
      map.off('click', 'clusters', handleClusterClick);
      map.off('click', 'unclustered-point', handleStationClick);
      map.off('mouseenter', 'unclustered-point', handleStationHover);
      map.off('mousemove', 'unclustered-point', handleStationHover);
      map.off('mouseleave', 'unclustered-point', handleStationLeave);
    };
  }, [map]);

  const clusterLayer: CircleLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'stations',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        5,
        '#f1f075',
        10,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        15,
        5,
        20,
        10,
        25
      ]
    }
  };

  const clusterCountLayer: SymbolLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'stations',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  };

  const unclusteredPointLayer: SymbolLayer = {
    id: 'unclustered-point',
    type: 'symbol',
    source: 'stations',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': 'buoy-icon',
      'icon-allow-overlap': true,
      'icon-size': 0.75
    }
  };

  return (
    <>
      {isImageLoaded && (
        <Source
          id="stations"
          type="geojson"
          data={geojsonData}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      )}

      {selectedStation && (
        <StationPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}

      {hoveredStation && (
        <BuoyHoverCard
          stationId={hoveredStation.station.id}
          stationName={hoveredStation.station.name}
          position={{ x: hoveredStation.x, y: hoveredStation.y }}
        />
      )}
    </>
  );
};

export default StationsLayer; 