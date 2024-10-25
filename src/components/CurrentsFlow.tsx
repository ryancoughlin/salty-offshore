import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Layer } from 'react-map-gl';
import type { CurrentCollection } from '../types/current.types';

interface CurrentsFlowProps {
    data: CurrentCollection;
    opacity: number;
    visible: boolean;
}

const CurrentsFlow = ({ data, opacity, visible }: CurrentsFlowProps) => {
    const scene = useRef(new THREE.Scene());
    const camera = useRef(new THREE.OrthographicCamera());
    const renderer = useRef<THREE.WebGLRenderer>();
    const particles = useRef<THREE.Points>();

    useEffect(() => {
        // Initialize Three.js components
        const initialize = () => {
            renderer.current = new THREE.WebGLRenderer({ alpha: true });
            renderer.current.setSize(window.innerWidth, window.innerHeight);
            
            // Create particle system
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(data.features.length * 3);
            const velocities = new Float32Array(data.features.length * 2);
            
            data.features.forEach((feature, i) => {
                const [lon, lat] = feature.geometry.coordinates;
                positions[i * 3] = lon;
                positions[i * 3 + 1] = lat;
                positions[i * 3 + 2] = 0;
                
                // Store velocity components for animation
                velocities[i * 2] = feature.properties.u;
                velocities[i * 2 + 1] = feature.properties.v;
            });

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 2));

            // Custom shader material for particles
            const material = new THREE.ShaderMaterial({
                vertexShader: `
                    attribute vec2 velocity;
                    uniform float time;
                    
                    void main() {
                        vec3 pos = position;
                        
                        // Animate position based on velocity
                        float speed = length(velocity);
                        float angle = atan(velocity.y, velocity.x);
                        
                        pos.x += cos(angle) * speed * time;
                        pos.y += sin(angle) * speed * time;
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = 2.0;
                    }
                `,
                fragmentShader: `
                    void main() {
                        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.8);
                    }
                `,
                uniforms: {
                    time: { value: 0.0 }
                },
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            particles.current = new THREE.Points(geometry, material);
            scene.current.add(particles.current);
        };

        initialize();
        animate();

        return () => {
            if (renderer.current) {
                renderer.current.dispose();
            }
        };
    }, [data]);

    // Animation loop
    const animate = () => {
        if (!particles.current || !renderer.current) return;

        const material = particles.current.material as THREE.ShaderMaterial;
        material.uniforms.time.value += 0.01;

        // Reset particles that move too far
        if (material.uniforms.time.value > 1.0) {
            material.uniforms.time.value = 0.0;
        }

        renderer.current.render(scene.current, camera.current);
        requestAnimationFrame(animate);
    };

    return (
        <Layer
            id="currents-flow"
            type="custom"
            onAdd={(map, gl) => {
                const canvas = renderer.current?.domElement;
                if (canvas) {
                    map.getCanvasContainer().appendChild(canvas);
                }
            }}
            onRemove={(map, gl) => {
                const canvas = renderer.current?.domElement;
                if (canvas && canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }}
            render={(gl, matrix) => {
                if (!renderer.current) return;
                
                // Update camera and renderer based on map view
                const { width, height } = gl.canvas;
                renderer.current.setSize(width, height);
                
                // Update particle positions based on map projection
                // ... (projection code here)
                
                renderer.current.render(scene.current, camera.current);
            }}
        />
    );
};

export default CurrentsFlow;
