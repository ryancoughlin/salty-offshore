import { memo } from 'react';

interface ContourLineInfo {
    temperature: number;
    breakStrength: 'weak' | 'moderate' | 'strong' | null;
    position: { x: number; y: number };
    length_nm: number;
}

const BreakStrengthIndicator = ({ strength }: { strength: ContourLineInfo['breakStrength'] }) => {
    const strengthConfig = {
        strong: {
            label: 'Strong',
            classes: 'bg-red-500'
        },
        moderate: {
            label: 'Moderate',
            classes: 'bg-yellow-500'
        },
        weak: {
            label: 'Weak',
            classes: 'bg-blue-500'
        }
    } as const;

    const config = strength && strengthConfig[strength] ? strengthConfig[strength] : strengthConfig.weak;

    return (
        <div className={`px-1 py-0.5 ${config.classes} justify-center items-center gap-2 flex`}>
            <div className="text-white text-xs font-normal font-sans">
                {config.label}
            </div>
        </div>
    );
};

export const BreakInfo = memo<{ info: ContourLineInfo }>(({ info }) => {
    const { temperature, breakStrength, length_nm } = info;

    if (!info.position) return null;

    return (
        <div
            className="absolute z-[9999] h-10 p-2 bg-neutral-950 justify-center items-center gap-2 inline-flex shadow-lg"
            style={{
                left: `${info.position.x}px`,
                top: `${info.position.y}px`,
                transform: 'translate(4px, 8px)',
                pointerEvents: 'none'
            }}
        >
            <BreakStrengthIndicator strength={breakStrength} />
            <div className="text-white text-sm font-normal font-mono">
                {temperature.toFixed(1)}° for {length_nm} nm
            </div>
        </div>
    );
});

BreakInfo.displayName = 'BreakInfo';