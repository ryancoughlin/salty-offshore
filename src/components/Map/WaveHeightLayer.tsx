import { memo, useMemo, useEffect, useRef, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';

interface WaveHeightLayerProps {
    data: GeoJSON.FeatureCollection;
    map: mapboxgl.Map;
    visible?: boolean;
}

const WaveHeightLayer = memo(({ data, map, visible = true }: WaveHeightLayerProps) => {
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const [hoveredFeatureId, setHoveredFeatureId] = useState<number | null>(null);
    
    // Keep existing Voronoi processing
    const processedData = useMemo(() => {
        try {
            const points = data.features.map(f => ({
                type: 'Feature',
                geometry: f.geometry,
                properties: f.properties
            }));

            const bbox = turf.bbox(data);
            const voronoiPolygons = turf.voronoi(turf.featureCollection(points), {
                bbox: [bbox[0], bbox[1], bbox[2], bbox[3]]
            });

            const features = voronoiPolygons.features.map(polygon => {
                const center = turf.center(polygon);
                const nearest = turf.nearestPoint(center, data);
                
                return {
                    type: 'Feature',
                    geometry: polygon.geometry,
                    properties: nearest.properties
                };
            });

            return {
                type: 'FeatureCollection',
                features
            };
        } catch (error) {
            console.error('Error processing wave data:', error);
            return data;
        }
    }, [data]);

    // Update hover state management
    useEffect(() => {
        if (!map) return;

        popupRef.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'bg-white/90 rounded-lg shadow-lg',
            maxWidth: '300px'
        });

        const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
            const feature = e.features?.[0];
            
            if (feature) {
                map.getCanvas().style.cursor = 'pointer';
                
                // Remove previous hover state
                if (hoveredFeatureId !== null) {
                    map.setFeatureState(
                        { source: 'wave-data', id: hoveredFeatureId },
                        { hover: false }
                    );
                }

                // Set new hover state
                const newHoveredId = feature.id as number;
                setHoveredFeatureId(newHoveredId);
                map.setFeatureState(
                    { source: 'wave-data', id: newHoveredId },
                    { hover: true }
                );

                // Update popup
                const { properties } = feature;
                const html = `
                    <div class="px-4 py-2 space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Height:</span>
                            <span class="font-medium">${properties.height.toFixed(1)}m</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Direction:</span>
                            <span class="font-medium">${properties.direction.toFixed(1)}°</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Period:</span>
                            <span class="font-medium">${properties.mean_period.toFixed(1)}s</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Energy:</span>
                            <span class="font-medium">${properties.wave_energy.toFixed(1)} kW/m</span>
                        </div>
                    </div>
                `;

                popupRef.current
                    ?.setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map);
            } else {
                // Clear hover state when not over a feature
                if (hoveredFeatureId !== null) {
                    map.setFeatureState(
                        { source: 'wave-data', id: hoveredFeatureId },
                        { hover: false }
                    );
                    setHoveredFeatureId(null);
                }
                map.getCanvas().style.cursor = '';
                popupRef.current?.remove();
            }
        };

        const handleMouseLeave = () => {
            if (hoveredFeatureId !== null) {
                map.setFeatureState(
                    { source: 'wave-data', id: hoveredFeatureId },
                    { hover: false }
                );
            }
            map.getCanvas().style.cursor = '';
            popupRef.current?.remove();
        };

        // Use mousemove instead of mouseenter for smoother transitions
        map.on('mousemove', 'wave-heights', handleMouseMove);
        map.on('mouseleave', 'wave-heights', handleMouseLeave);

        return () => {
            if (hoveredFeatureId !== null) {
                map.setFeatureState(
                    { source: 'wave-data', id: hoveredFeatureId },
                    { hover: false }
                );
            }
            map.off('mousemove', 'wave-heights', handleMouseMove);
            map.off('mouseleave', 'wave-heights', handleMouseLeave);
            popupRef.current?.remove();
        };
    }, [map, hoveredFeatureId]);

    // Keep existing layer configuration
    const fillExtrusionLayer: LayerProps = {
        slot: 'middle',
        id: 'wave-heights',
        type: 'fill-extrusion',
        paint: {
            'fill-extrusion-height': ['*', ['get', 'height'], 50000],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.7,
            'fill-extrusion-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                // Brighter color on hover
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'height'],
                    0, '#4147AD',    // Brighter version
                    0.5, '#5B8FD1',
                    1, '#8FC1E4',
                    1.5, '#C4E5F2',
                    2, '#FFFFFF',
                    2.5, '#FFE7A3',
                    3, '#FFC374',
                    4, '#FF8256',
                    5, '#F0432A',
                    6, '#C2102E'
                ],
                // Default colors
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'height'],
                    0, '#313695',
                    0.5, '#4575b4',
                    1, '#74add1',
                    1.5, '#abd9e9',
                    2, '#e0f3f8',
                    2.5, '#fee090',
                    3, '#fdae61',
                    4, '#f46d43',
                    5, '#d73027',
                    6, '#a50026'
                ]
            ]
        }
    };

    // Add light configuration
    useEffect(() => {
        if (!map) return;

        map.setLight({
            anchor: 'viewport',
            color: 'white',
            intensity: 0.4,
            position: [1.5, 90, 80]
        });

        return () => {
            map.setLight({
                anchor: 'viewport',
                color: 'white',
                intensity: 0.15,
                position: [1.15, 210, 30]
            });
        };
    }, [map]);

    if (!visible) return null;

    return (
        <Source 
            id="wave-data"
            type="geojson" 
            data={processedData}
            generateId={true}
        >
            <Layer {...fillExtrusionLayer} />
        </Source>
    );
});

WaveHeightLayer.displayName = 'WaveHeightLayer';

export default WaveHeightLayer; 