import { memo } from 'react';

interface WaveInfoProps {
    info: {
        height: number;
        direction: number;
        mean_period: number;
        wave_energy: number;
        position: { x: number; y: number };
    };
}

export const WaveInfo = memo<WaveInfoProps>(({ info }) => {
    const { height, direction, mean_period, wave_energy } = info;

    return (
        <div 
            className="absolute z-10 px-4 py-3 bg-white/90 rounded-lg shadow-lg"
            style={{ 
                left: info.position.x, 
                top: info.position.y,
                transform: 'translate(-50%, -100%)',
                marginTop: -8 
            }}
        >
            <div className="space-y-1.5 text-sm min-w-[180px]">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{height.toFixed(1)}m</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Direction:</span>
                    <span className="font-medium">{direction.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">{mean_period.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Energy:</span>
                    <span className="font-medium">{wave_energy.toFixed(1)} kW/m</span>
                </div>
            </div>
        </div>
    );
});

WaveInfo.displayName = 'WaveInfo'; 