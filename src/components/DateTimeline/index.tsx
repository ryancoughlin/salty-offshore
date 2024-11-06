import { useDateFiltering } from '../../hooks/useDateFiltering';
import { DateButton } from './DateButton';
import type { Dataset } from '../../types/api';
import type { ISODateString } from '../../types/date';

interface DateTimelineProps {
    dataset: Dataset;
    selectedDate: ISODateString | null;
    onDateSelect: (date: ISODateString) => void;
}

export const DateTimeline = ({
    dataset,
    selectedDate,
    onDateSelect
}: DateTimelineProps) => {
    const dates = useDateFiltering(dataset);

    if (!dates.length) {
        return null;
    }

    return (
        <div className="flex justify-center items-center overflow-x-auto">
            {dates.map((date) => (
                <DateButton
                    key={date}
                    date={date}
                    isSelected={date === selectedDate}
                    onSelect={onDateSelect}
                />
            ))}
        </div>
    );
};