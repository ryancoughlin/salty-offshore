import { memo } from 'react';

interface WaveInfoProps {
    info: {
        height: number;
        direction: number;
        mean_period: number;
        position: { x: number; y: number };
    };
}

export const WaveInfo = memo<WaveInfoProps>(({ info }) => {
    const { height, direction, mean_period, position } = info;

    return (
        <div 
            className="absolute z-10 px-4 py-2 bg-white/90 rounded-lg shadow-lg border border-gray-200"
            style={{ 
                left: position.x + 10, 
                top: position.y + 10,
                maxWidth: '200px'
            }}
        >
            <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{height.toFixed(1)}m</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Direction:</span>
                    <span className="font-medium">{direction.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">{mean_period.toFixed(1)}s</span>
                </div>
            </div>
        </div>
    );
});

WaveInfo.displayName = 'WaveInfo'; 