import { useEffect, useRef, useMemo, memo } from 'react';
import type { CustomLayerInterface } from 'mapbox-gl';
import { ParticleSystem } from './ParticleSystem';
import type { CurrentAnimationProps } from './types';

const OceanCurrentAnimation = memo<CurrentAnimationProps>(({
  selectedRegion,
  map,
  geoJsonData,
  config
}) => {
  const layerId = useRef(`ocean-currents-${Math.random().toString(36).slice(2)}`);
  const particleSystem = useRef<ParticleSystem | null>(null);
  const frameId = useRef<number>();

  const customLayer = useMemo<CustomLayerInterface>(() => ({
    id: layerId.current,
    type: 'custom',
    renderingMode: '2d',
    
    onAdd: function(map: mapboxgl.Map, gl: WebGLRenderingContext) {
      console.log('Custom layer onAdd:', {
        mapCenter: map.getCenter(),
        zoom: map.getZoom(),
        glContext: gl.getParameter(gl.VERSION)
      });
      
      particleSystem.current = new ParticleSystem(gl, selectedRegion, geoJsonData, map, config);
      
      const animate = () => {
        frameId.current = requestAnimationFrame(animate);
        map.triggerRepaint();
      };
      animate();
    },

    render: function(gl: WebGLRenderingContext, matrix: number[]) {
      particleSystem.current?.render(gl, matrix);
    },

    onRemove: function() {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      particleSystem.current?.dispose();
      particleSystem.current = null;
    }
  }), []);

  useEffect(() => {
    if (!map || !geoJsonData?.features?.length) return;
    
    map.addLayer(customLayer);
    return () => {
      if (map.getLayer(layerId.current)) {
        map.removeLayer(layerId.current);
      }
    };
  }, [map, geoJsonData, customLayer]);

  return null;
});

export default OceanCurrentAnimation;