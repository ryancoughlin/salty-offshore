import React from 'react';
import sstColorScale from '../utils/sst_color_scale.json';

interface ColorGradientProps {
    min: number;
    max: number;
}

const ColorGradient: React.FC<ColorGradientProps> = ({ min, max }) => {
    const gradient = `linear-gradient(to right, ${sstColorScale.colors.join(', ')})`;

    return (
        <div className="flex items-center gap-2 px-4 py-2">
            <span className="text-sm text-gray-200">{min}°</span>
            <div
                className="h-4 w-40 rounded"
                style={{ background: gradient }}
                role="img"
                aria-label={`Color gradient from ${min} to ${max}`}
            />
            <span className="text-sm text-gray-200">{max}°</span>
        </div>
    );
};

export default ColorGradient; 