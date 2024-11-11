import { Source, Layer } from 'react-map-gl';
import { memo, useEffect, useState } from 'react';
import type { RegionInfo } from '../../types/api';

interface RegionNavigationLayerProps {
  regions: RegionInfo[];
  map: mapboxgl.Map;
}

export const RegionNavigationLayer = memo<RegionNavigationLayerProps>(({ regions, map }) => {
  const sourceId = 'region-navigation';
  const layerId = 'region-navigation-fill';
  
  // Track hover states
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);

  useEffect(() => {
    if (!map) return;

    const onMouseEnter = (e: mapboxgl.MapMouseEvent) => {
      const feature = e.features?.[0];
      const featureId = feature?.properties?.id;
      console.log('Mouse enter feature:', feature);
      console.log('featureId', featureId);
      
      if (feature?.properties?.id) {
        // Clear previous hover state
        if (hoveredFeatureId) {
            console.log('clearing previous hover state');
          map.setFeatureState(
            { source: sourceId, id: hoveredFeatureId },
            { hover: false }
          );
        }
        
        // Set new hover state
        map.setFeatureState(
          { source: sourceId, id: featureId },
          { hover: true }
        );

        map.getCanvas().style.cursor = 'pointer';
        setHoveredFeatureId(featureId);
      }
    };

    const onMouseLeave = () => {
      if (hoveredFeatureId) {
        map.setFeatureState(
          { source: sourceId, id: hoveredFeatureId },
          { hover: false }
        );
        map.getCanvas().style.cursor = '';
        setHoveredFeatureId(null);
      }
    };

    map.on('mousemove', layerId, onMouseEnter);
    map.on('mouseleave', layerId, onMouseLeave);

    return () => {
      map.off('mouseenter', layerId, onMouseEnter);
      map.off('mouseleave', layerId, onMouseLeave);
      onMouseLeave(); // Clean up any remaining hover states
    };
  }, [map, hoveredFeatureId]);

  return (
    <Source 
      id={sourceId}
      type="geojson"
      data={{
        type: 'FeatureCollection',
        features: regions.map(region => ({
          type: 'Feature',
          id: region.id,
          properties: {
            id: region.id,
            name: region.name
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [region.bounds[0][0], region.bounds[0][1]],
              [region.bounds[1][0], region.bounds[0][1]],
              [region.bounds[1][0], region.bounds[1][1]],
              [region.bounds[0][0], region.bounds[1][1]],
              [region.bounds[0][0], region.bounds[0][1]]
            ]]
          }
        }))
      }}
    >
      <Layer
        id={layerId}
        type="fill"
        paint={{
          'fill-color': '#ffffff',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.8,
            0.2
          ],
          'fill-outline-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#000',
            '#fff'
          ]
        }}
      />
    </Source>
  );
});