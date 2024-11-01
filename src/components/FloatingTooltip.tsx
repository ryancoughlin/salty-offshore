import { useState, useEffect } from 'react';
import sstColors from '../utils/sst_color_scale.json';

interface FloatingTooltipProps {
    temperature: number | null;
    offsetY?: number;
}

export const FloatingTooltip: React.FC<FloatingTooltipProps> = ({
    temperature,
    offsetY = 10
}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [smoothTemp, setSmoothTemp] = useState<number | null>(null);

    // Smooth temperature transitions
    useEffect(() => {
        if (temperature === null) {
            setSmoothTemp(null);
            return;
        }

        // If it's the first temperature value, set it immediately
        if (smoothTemp === null) {
            setSmoothTemp(temperature);
            return;
        }

        // Smoothly interpolate between current and new temperature
        const diff = temperature - smoothTemp;
        if (Math.abs(diff) > 0.01) {
            setSmoothTemp(prev => prev! + diff * 0.5);
        }
    }, [temperature, smoothTemp]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const getColorForTemperature = (temp: number): string => {
        const minTemp = 32;
        const maxTemp = 80;

        const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));
        const normalizedTemp = (clampedTemp - minTemp) / (maxTemp - minTemp);

        const index = Math.min(
            Math.floor(normalizedTemp * (sstColors.colors.length - 1)),
            sstColors.colors.length - 1
        );

        return sstColors.colors[index];
    };

    const getTextColor = (bgColor: string) => {
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
    };

    if (!temperature || smoothTemp === null) return null;

    const backgroundColor = getColorForTemperature(smoothTemp);
    const textColor = getTextColor(backgroundColor);

    // Format temperature with more precision
    const tempLabel = (temp: number) => {
        return temp.toFixed(2);
    };

    return (
        <div
            className="fixed pointer-events-none z-50"
            style={{
                left: position.x,
                top: position.y,
                transform: `translate(-50%, ${offsetY}px)`
            }}
        >
            <div className="relative flex flex-col items-center">
                <div
                    className="rounded shadow-lg p-1"
                    style={{
                        backgroundColor,
                        color: textColor
                    }}
                >
                    <div className="text-xs font-medium tracking-tight">
                        {tempLabel(smoothTemp)}
                    </div>
                </div>
            </div>
        </div>
    );
}; 