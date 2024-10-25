import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { CurrentCollection } from '../types/current.types';

interface CurrentsFlowLayerProps {
    map: mapboxgl.Map;
    data: CurrentCollection;
    visible: boolean;
    opacity: number;
}

const CurrentsFlowLayer = ({ map, data, visible, opacity }: CurrentsFlowLayerProps) => {
    const sourceId = 'currents-source';
    const layerId = 'currents-layer';
    const animationRef = useRef<number>();

    useEffect(() => {
        const particles = data.features.flatMap(feature => {
            return Array(5).fill(null).map(() => ({
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
                age: Math.random() * 50,
                u: feature.properties.u_norm,
                v: feature.properties.v_norm
            }));
        });

        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });
        }

        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'circle',
                source: sourceId,
                paint: {
                    'circle-radius': 3,
                    'circle-color': '#00ffff',
                    'circle-opacity': ['interpolate', ['linear'], ['get', 'age'], 0, 1, 50, 0]
                }
            });
        }

        function animate() {
            particles.forEach(particle => {
                particle.x += particle.u * 0.1;
                particle.y += particle.v * 0.1;
                particle.age += 1;

                if (particle.age > 50) {
                    const feature = data.features[Math.floor(Math.random() * data.features.length)];
                    particle.x = feature.geometry.coordinates[0];
                    particle.y = feature.geometry.coordinates[1];
                    particle.age = 0;
                }
            });

            map.getSource(sourceId)?.setData({
                type: 'FeatureCollection',
                features: particles.map(particle => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [particle.x, particle.y]
                    },
                    properties: { age: particle.age }
                }))
            });

            animationRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        };
    }, [map, data]);

    useEffect(() => {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
            map.setPaintProperty(layerId, 'circle-opacity-transition', { duration: 300 });
            map.setPaintProperty(layerId, 'circle-opacity', opacity);
        }
    }, [map, visible, opacity]);

    return null;
};

export default CurrentsFlowLayer;
