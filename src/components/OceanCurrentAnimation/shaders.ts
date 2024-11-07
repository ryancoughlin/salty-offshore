export const vertexShader = `
    uniform float u_zoom;
    attribute vec2 velocity;
    varying vec2 vVelocity;
    
    void main() {
        vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = pos;
        gl_PointSize = 3.0 * u_zoom;
        vVelocity = velocity;
    }
`;

export const fragmentShader = `
    uniform float u_opacity;
    varying vec2 vVelocity;
    
    void main() {
        // Circular particle
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;
        
        // Color based on velocity
        float speed = length(vVelocity);
        vec3 color = mix(
            vec3(0.0, 0.3, 1.0),  // Slow (blue)
            vec3(0.0, 1.0, 1.0),  // Fast (cyan)
            speed
        );
        
        gl_FragColor = vec4(color, u_opacity);
    }
`;
