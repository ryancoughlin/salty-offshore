import React from 'react';

interface ContourLineInfo {
    temperature: number;
    breakStrength: 'strong' | 'moderate' | 'weak';
    position: { x: number; y: number };
    length_nm: number;
}

interface BreakInfoProps {
    info: ContourLineInfo;
}

export const BreakInfo: React.FC<BreakInfoProps> = ({ info }) => {
    const { temperature, breakStrength, position, length_nm } = info;

    if (!position) return null;

    const strengthColors = {
        strong: 'bg-red-500',
        moderate: 'bg-yellow-500',
        weak: 'bg-blue-500'
    };

    const strengthDescriptions = {
        strong: "Major temperature break - Prime fishing area",
        moderate: "Moderate temperature change - Good structure",
        weak: "Minor temperature variation"
    };

    return (
        <div
            className="absolute z-[9999] p-3 rounded-lg shadow-lg bg-black/80 backdrop-blur-sm border border-white/10"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(10px, -50%)',
                pointerEvents: 'none',
                minWidth: '200px'
            }}
        >
            <div className="space-y-2">
                <div className="text-lg font-bold text-white">
                    {temperature.toFixed(1)}°F
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-block w-2 h-2 rounded-full ${strengthColors[breakStrength]}`}
                    />
                    <span className="text-sm text-white/90">
                        {strengthDescriptions[breakStrength]}
                    </span>
                </div>
                <div className="text-sm text-white/90">
                    Length: {length_nm} nm
                </div>
                {temperature >= 68 && temperature <= 75 && (
                    <div className="text-xs text-emerald-400 font-medium mt-1">
                        🎯 Prime fishing temperature range
                    </div>
                )}
            </div>
        </div>
    );
}; 