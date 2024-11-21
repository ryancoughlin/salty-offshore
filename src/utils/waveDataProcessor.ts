import * as turf from '@turf/turf';

interface ProcessedWaveData extends GeoJSON.FeatureCollection {
    features: Array<GeoJSON.Feature<GeoJSON.Polygon>>;
}

export const processWaveData = (data: GeoJSON.FeatureCollection): ProcessedWaveData => {
    // Create a bounding box from the points
    const bbox = turf.bbox(data);
    
    // Create a grid of points for interpolation
    const cellSize = 0.025; // degrees
    const options = { units: 'degrees' as const };
    const grid = turf.pointGrid(bbox, cellSize, options);

    // Get all the wave height values
    const waveHeights = data.features.map(f => ({
        longitude: f.geometry.coordinates[0],
        latitude: f.geometry.coordinates[1],
        height: f.properties?.height || 0
    }));

    // Convert points to polygons and interpolate heights
    const features = grid.features.map(point => {
        const [lon, lat] = point.geometry.coordinates;
        
        // Use IDW (Inverse Distance Weighting) for interpolation
        let weightedSum = 0;
        let weightSum = 0;
        
        waveHeights.forEach(wave => {
            const distance = turf.distance(
                [lon, lat],
                [wave.longitude, wave.latitude],
                { units: 'kilometers' }
            );
            
            // Avoid division by zero
            const weight = distance === 0 ? 1 : 1 / Math.pow(distance, 2);
            weightedSum += wave.height * weight;
            weightSum += weight;
        });

        const interpolatedHeight = weightSum === 0 ? 0 : weightedSum / weightSum;

        // Create a polygon feature for the grid cell
        const cell = turf.buffer(point, cellSize / 2, {
            units: 'degrees',
            steps: 4
        });

        return {
            type: 'Feature',
            geometry: cell.geometry,
            properties: {
                height: interpolatedHeight
            }
        } as GeoJSON.Feature<GeoJSON.Polygon>;
    });

    return {
        type: 'FeatureCollection',
        features
    };
}; 