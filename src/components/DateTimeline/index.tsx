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
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {dates.map((date) => {
                    const isSelected = date === selectedDate;
                    const dateObj = new Date(date);

                    return (
                        <button
                            key={date}
                            onClick={() => onDateSelect(date)}
                            className={`
                                flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium
                                transition-all duration-200 ease-in-out
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${isSelected
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                }
                            `}
                            aria-label={`Select date ${dateObj.toLocaleDateString()}`}
                            aria-pressed={isSelected}
                        >
                            <div className="flex flex-col items-center">
                                <span>{formatDateForDisplay(parseISODate(date))}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};