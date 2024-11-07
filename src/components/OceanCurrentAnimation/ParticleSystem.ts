// ParticleSystem.ts
import * as THREE from "three";
import type { RegionInfo } from "../../types";
import * as mapboxgl from "mapbox-gl";

export class ParticleSystem {
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private particles: THREE.Points;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;

  constructor(
    gl: WebGLRenderingContext,
    selectedRegion: RegionInfo,
    geoJsonData: GeoJSON.FeatureCollection,
    config?: CurrentAnimationConfig
  ) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const count = config?.particleCount || 100;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const featureIndex = i % geoJsonData.features.length;
      const feature = geoJsonData.features[featureIndex];
      const [lng, lat] = feature.geometry.coordinates;
      const mercator = mapboxgl.MercatorCoordinate.fromLngLat({ lng, lat });

      const idx = i * 3;
      positions[idx] = mercator.x;
      positions[idx + 1] = mercator.y;
      positions[idx + 2] = 0;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.material = new THREE.PointsMaterial({
      color: config?.particleColor || 0xff0000,
      size: 10,
      sizeAttenuation: false,
      transparent: true,
      opacity: config?.fadeOpacity ? 0.6 : 0.8
    });

    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);
  }

  public render(gl: WebGLRenderingContext, matrix: number[]): void {
    const renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl
    });
    renderer.autoClear = false;
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.camera.projectionMatrix.fromArray(matrix);
    renderer.render(this.scene, this.camera);
    renderer.dispose();
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}