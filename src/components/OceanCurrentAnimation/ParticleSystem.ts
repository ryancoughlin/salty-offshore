// ParticleSystem.ts
import * as THREE from "three";
import type { RegionInfo } from "../../types";
import { CurrentAnimationConfig } from "./types";
import {vertexShader, fragmentShader} from "./shaders";
import * as mapboxgl from "mapbox-gl";

export class ParticleSystem {
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private particles: THREE.Points;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private velocities: Float32Array;
  private positions: Float32Array;
  private bounds: [number, number, number, number];
  private speedFactor: number;
  private map: mapboxgl.Map;

  constructor(
    gl: WebGLRenderingContext,
    selectedRegion: RegionInfo,
    geoJsonData: GeoJSON.FeatureCollection,
    map: mapboxgl.Map,
    config?: CurrentAnimationConfig
  ) {
    this.map = map;
    this.scene = new THREE.Scene();
    this.speedFactor = config?.speedFactor || 0.15;
    
    // Set bounds first
    const [[minLng, minLat], [maxLng, maxLat]] = selectedRegion.bounds;
    this.bounds = [minLng, minLat, maxLng, maxLat];

    // Simple orthographic camera matching the bounds
    this.camera = new THREE.OrthographicCamera(
      minLng, maxLng,
      maxLat, minLat,
      -1, 1
    );

    const count = config?.particleCount || 100;
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      const featureIndex = i % geoJsonData.features.length;
      const feature = geoJsonData.features[featureIndex];
      
      let coordinates: [number, number];
      if (feature.geometry.type === 'Point') {
        coordinates = feature.geometry.coordinates as [number, number];
      } else if (feature.geometry.type === 'LineString') {
        const lineCoords = feature.geometry.coordinates as [number, number][];
        coordinates = lineCoords[0];
      } else if (feature.geometry.type === 'Polygon') {
        const polyCoords = feature.geometry.coordinates as [number, number][][];
        coordinates = polyCoords[0][0];
      } else {
        coordinates = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
      }

      const mercator = mapboxgl.MercatorCoordinate.fromLngLat({
        lng: coordinates[0],
        lat: coordinates[1]
      });

      const idx = i * 3;
      this.positions[idx] = mercator.x;
      this.positions[idx + 1] = mercator.y;
      this.positions[idx + 2] = 0;

      const vIdx = i * 2;
      const magnitude = feature.properties?.vector_magnitude || 0;
      this.velocities[vIdx] = (feature.properties?.u || 0) / magnitude;
      this.velocities[vIdx + 1] = (feature.properties?.v || 0) / magnitude;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('velocity', new THREE.BufferAttribute(this.velocities, 2));

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        u_opacity: { value: config?.fadeOpacity ? 0.6 : 0.8 },
        u_zoom: { value: Math.max(map.getZoom() - 4, 1) }
      }
    });

    console.log('ParticleSystem init:', {
      bounds: this.bounds,
      particleCount: count,
      sceneChildren: this.scene.children
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);
    console.log('Particles added:', {
      positions: this.positions,
      velocities: this.velocities,
      uniforms: this.material.uniforms
    });

    this.map.on('zoom', this.updateZoom);
  }

  private updateZoom = () => {
    this.material.uniforms.u_zoom.value = Math.max(this.map.getZoom() - 4, 1);
  }

  private updateParticles(): void {
    const positions = this.geometry.attributes.position.array as Float32Array;
    const velocities = this.geometry.attributes.velocity.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Update positions
      positions[i] += velocities[i/3 * 2] * this.speedFactor;
      positions[i + 1] += velocities[i/3 * 2 + 1] * this.speedFactor;

      // Wrap around bounds
      if (positions[i] < this.bounds[0]) positions[i] = this.bounds[2];
      if (positions[i] > this.bounds[2]) positions[i] = this.bounds[0];
      if (positions[i + 1] < this.bounds[1]) positions[i + 1] = this.bounds[3];
      if (positions[i + 1] > this.bounds[3]) positions[i + 1] = this.bounds[1];
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  public render(gl: WebGLRenderingContext, matrix: number[]): void {
    this.updateParticles();
    
    const renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl
    });
    renderer.autoClear = false;
    
    this.camera.projectionMatrix.fromArray(matrix);
    renderer.render(this.scene, this.camera);
    renderer.dispose();
  }

  public dispose(): void {
    this.map.off('zoom', this.updateZoom);
    this.geometry.dispose();
    this.material.dispose();
  }
}