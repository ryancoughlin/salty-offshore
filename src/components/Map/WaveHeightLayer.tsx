import { memo, useMemo, useEffect, useRef, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import type { Point, Position } from 'geojson';
import { WaveInfo } from './WaveInfo';

interface WaveProperties {
    height: number;
    direction: number;
    mean_period: number;
    wave_energy: number;
}

interface WaveHeightLayerProps {
    data: GeoJSON.FeatureCollection<Point, WaveProperties>;
    map: mapboxgl.Map;
    visible?: boolean;
}

const WaveHeightLayer = memo(({ data, map, visible = true }: WaveHeightLayerProps) => {
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const [hoveredFeatureId, setHoveredFeatureId] = useState<number | null>(null);
    const [waveInfo, setWaveInfo] = useState<{
        height: number;
        direction: number;
        mean_period: number;
        wave_energy: number;
        position: { x: number; y: number };
    } | undefined>(undefined);
    
    const processedData = useMemo(() => {
        try {
            const points = data.features.map(f => 
                turf.point(
                    f.geometry.coordinates as Position,
                    f.properties
                )
            );

            const bbox = turf.bbox(turf.featureCollection(points));
            const voronoiPolygons = turf.voronoi(turf.featureCollection(points), {
                bbox: bbox
            });

            const features = voronoiPolygons.features.map((polygon) => {
                const center = turf.center(polygon);
                const pointFeatures = turf.featureCollection(
                    data.features.filter(f => f.geometry.type === 'Point')
                );
                const nearest = turf.nearestPoint(center, pointFeatures);
                
                return {
                    type: 'Feature' as const,
                    geometry: polygon.geometry,
                    properties: nearest.properties
                };
            });

            return {
                type: 'FeatureCollection' as const,
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
            
            if (!feature?.properties) {
                // Clear hover state when no feature or properties
                if (hoveredFeatureId !== null) {
                    map?.setFeatureState(
                        { source: 'wave-data', id: hoveredFeatureId },
                        { hover: false }
                    );
                    setHoveredFeatureId(null);
                }
                setWaveInfo(undefined);
                return;
            }

            const { height, direction, mean_period, wave_energy } = feature.properties;

            // Early return if any required property is null/undefined
            if (height == null || direction == null || mean_period == null || wave_energy == null) {
                setWaveInfo(undefined);
                return;
            }

            setWaveInfo({
                height,
                direction,
                mean_period,
                wave_energy,
                position: { x: e.point.x, y: e.point.y }
            });
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
        <>
            <Source 
                id="wave-data"
                type="geojson" 
                data={processedData}
                generateId={true}
            >
                <Layer {...fillExtrusionLayer} />
            </Source>
            {waveInfo && <WaveInfo info={waveInfo} />}
        </>
    );
});

WaveHeightLayer.displayName = 'WaveHeightLayer';

export default WaveHeightLayer; 