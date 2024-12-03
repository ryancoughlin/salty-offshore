import { DatasetType } from '../types/datasets';

export const log10 = (value: number) => Math.log10(Math.max(value, Number.EPSILON));

export const getNormalizedValue = (
    value: number,
    min: number,
    max: number,
    datasetType: DatasetType | undefined
): number => {
    switch (datasetType) {
        case DatasetType.CHLOROPHYLL:
            // Use logarithmic scaling for chlorophyll
            return (log10(value) - log10(min)) / (log10(max) - log10(min));
        default:
            // Use linear scaling for other datasets
            return (value - min) / (max - min);
    }
};

export const getInterpolatedColor = (
    value: number,
    min: number,
    max: number,
    colors: string[],
    datasetType: DatasetType | undefined
): string => {
    const normalizedValue = getNormalizedValue(value, min, max, datasetType);
    const colorIndex = normalizedValue * (colors.length - 1);

    const lowerIndex = Math.floor(colorIndex);
    const upperIndex = Math.ceil(colorIndex);

    // Handle edge cases
    if (lowerIndex === upperIndex || upperIndex >= colors.length) {
        return colors[Math.min(lowerIndex, colors.length - 1)];
    }

    const fraction = colorIndex - lowerIndex;
    const lowerColor = colors[lowerIndex];
    const upperColor = colors[upperIndex];

    // Interpolate between colors
    const r1 = parseInt(lowerColor.slice(1, 3), 16);
    const g1 = parseInt(lowerColor.slice(3, 5), 16);
    const b1 = parseInt(lowerColor.slice(5, 7), 16);
    const r2 = parseInt(upperColor.slice(1, 3), 16);
    const g2 = parseInt(upperColor.slice(3, 5), 16);
    const b2 = parseInt(upperColor.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * fraction);
    const g = Math.round(g1 + (g2 - g1) * fraction);
    const b = Math.round(b1 + (b2 - b1) * fraction);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const formatDatasetValue = (
    val: number,
    datasetType: DatasetType | undefined,
    unit: string
): string => {
    switch (datasetType) {
        case DatasetType.BLENDED_SST:
        case DatasetType.LEO_SST:
        case DatasetType.WAVE_HEIGHT:
            return `${val.toFixed(1)}${unit}`;
        case DatasetType.CHLOROPHYLL:
        case DatasetType.CURRENTS:
            return `${val.toFixed(2)}${unit}`;
        default:
            return `${val}${unit}`;
    }
};

export const calculateGradientStops = (
    min: number,
    max: number,
    colors: string[],
    datasetType: DatasetType | undefined,
    numStops = 20
): string => {
    const stops = [];

    for (let i = 0; i <= numStops; i++) {
        const percent = (i / numStops) * 100;
        let value: number;

        if (datasetType === DatasetType.CHLOROPHYLL) {
            // Use logarithmic spacing for chlorophyll
            const t = i / numStops;
            value = Math.pow(10, log10(min) + t * (log10(max) - log10(min)));
        } else {
            // Use linear spacing for other datasets
            value = min + ((max - min) * (i / numStops));
        }

        const color = getInterpolatedColor(value, min, max, colors, datasetType);
        stops.push(`${color} ${percent}%`);
    }

    return stops.join(', ');
}; 