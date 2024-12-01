import { useMemo } from 'react';
import useStationData from '../../hooks/useStationData';

interface StationHoverCardProps {
    stationId: string;
    stationName: string;
    position: { x: number; y: number };
}

interface MetricProps {
    label: string;
    value: number | null | undefined;
    unit: string;
}

const LoadingSpinner = () => (
    <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-400" />
    </div>
);

const Metric = ({ label, value, unit }: MetricProps) => (
    <div className="w-20 flex-col justify-start items-start gap-1 inline-flex">
        <div className="self-stretch text-neutral-400 font-medium text-xs">{label}</div>
        <div className="self-stretch text-gray-200 text-base font-mono">
            {value == null ? 'N/A' : `${value.toFixed(1)}${unit}`}
        </div>
    </div>
);

const MessageDisplay = ({ message }: { message: string }) => (
    <div className="flex-1 flex items-center justify-center text-neutral-400 text-xs">
        {message}
    </div>
);

const StationHoverCard = ({ stationId, stationName, position }: StationHoverCardProps) => {
    const { data, loading, error } = useStationData(stationId);

    const currentConditions = useMemo(() => {
        if (!data?.data?.currentConditions) return null;
        return data.data.currentConditions;
    }, [data]);

    const metrics: MetricProps[] = useMemo(() => {
        if (!currentConditions) return [];
        return [
            { label: 'Wind Speed', value: currentConditions.windSpeed, unit: 'kt' },
            { label: 'Wave Height', value: currentConditions.waveHeight, unit: "'" },
            { label: 'Period', value: currentConditions.dominantWavePeriod, unit: 's' }
        ];
    }, [currentConditions]);

    return (
        <div
            className="absolute z-50 w-68 bg-neutral-950 flex flex-col h-[106px] font-sans"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(12px, 15%)',
            }}
        >
            <div className="flex-1 p-3">
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <MessageDisplay message="Unable to load station data" />
                ) : !currentConditions ? (
                    <MessageDisplay message="No data available" />
                ) : (
                    <div className="flex gap-4">
                        {metrics.map((metric, index) => (
                            <Metric key={index} {...metric} />
                        ))}
                    </div>
                )}
            </div>
            <div className="h-10 p-3 border-t border-white/10 flex items-center">
                <div className="text-gray-200 text-sm font-bold">
                    {stationName}
                </div>
            </div>
        </div>
    );
};

export default StationHoverCard; 