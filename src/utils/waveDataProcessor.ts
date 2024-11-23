import * as turf from '@turf/turf';
import type { Feature, FeatureCollection, Point, Polygon } from 'geojson';

// Clear type definitions
interface WaveProperties {
    height: number | null;
    direction: number | null;
    mean_period: number | null;
    wave_energy: number | null;
}

interface ProcessedWaveData extends FeatureCollection<Polygon, WaveProperties> {
    features: Array<Feature<Polygon, WaveProperties>>;
}

export const processWaveData = (data: FeatureCollection<Point, WaveProperties>): ProcessedWaveData => {
    try {
        // Create properly typed points for Turf operations
        const points = data.features
            .filter(feature => feature.properties?.height != null)
            .map(feature => turf.point(
                feature.geometry.coordinates,
                feature.properties
            ));

        const pointCollection = turf.featureCollection(points);
        const bbox = turf.bbox(pointCollection);
        
        // Create interpolation grid
        const cellSize = 0.025; // degrees
        const grid = turf.pointGrid(bbox, cellSize, { units: 'degrees' });

        // Process grid points with proper typing
        const features = grid.features.map(point => {
            const interpolatedProperties = interpolateWaveProperties(
                point.geometry.coordinates,
                data.features
            );

            const cell = turf.buffer(point, cellSize / 2, {
                units: 'degrees',
                steps: 4
            });

            return {
                type: 'Feature' as const,
                geometry: cell?.geometry as Polygon,
                properties: interpolatedProperties
            };
        });

        return {
            type: 'FeatureCollection',
            features
        };
    } catch (error) {
        console.error('Error processing wave data:', error);
        return {
            type: 'FeatureCollection',
            features: []
        };
    }
};

const interpolateWaveProperties = (
    targetPoint: number[], 
    sourceFeatures: Array<Feature<Point, WaveProperties>>
): WaveProperties => {
    let weightedSum = 0;
    let weightSum = 0;

    sourceFeatures.forEach(feature => {
        if (!feature.properties?.height) return;

        const distance = turf.distance(
            targetPoint,
            feature.geometry.coordinates,
            { units: 'kilometers' }
        );

        // Use inverse distance weighting
        const weight = distance === 0 ? 1 : 1 / Math.pow(distance, 2);
        weightedSum += feature.properties.height * weight;
        weightSum += weight;
    });

    return {
        height: weightSum === 0 ? null : weightedSum / weightSum,
        direction: null, // These would follow similar interpolation patterns
        mean_period: null,
        wave_energy: null
    };
}; 