import { useMemo } from 'react';
import type { Dataset, DateEntry } from '../../types/api';
import { parseISODate, formatDateForDisplay } from '../../utils/date';
import type { ISODateString } from '../../types/date';


interface DateTimelineProps {
    dataset: Dataset;
    selectedDate: ISODateString | null;
    onDateSelect: (date: ISODateString) => void;
}

export const DateTimeline: React.FC<DateTimelineProps> = ({
    dataset,
    selectedDate,
    onDateSelect
}) => {
    const dates = useMemo(() => {
        if (!dataset?.dates) {
            console.warn('Dataset has no dates array:', dataset);
            return [];
        }

        const filtered = dataset.dates
            .filter((entry: DateEntry) => entry.date && Object.keys(entry.layers).length > 0)
            .map((entry: DateEntry) => entry.date)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        return filtered;
    }, [dataset]);

    if (!dates.length) {
        console.error('No dates available for dataset:', dataset);
        return null;
    }
    return (
        <div className="flex justify-center items-center overflow-x-auto">
            {dates.map((date) => {
                const isSelected = date === selectedDate;
                const dateObj = new Date(date);

                return (
                    <button
                        key={date}
                        onClick={() => onDateSelect(date)}
                        className={`
                                h-16 p-6 border-r border-white/10 justify-center items-center inline-flex
                                ${isSelected
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-neutral-950 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }
                            `}
                        aria-label={`Select date ${dateObj.toLocaleDateString()}`}
                        aria-pressed={isSelected}
                    >
                        <div className="text-white text-base font-medium font-sans">
                            {formatDateForDisplay(parseISODate(date))}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};