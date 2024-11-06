import { parseISODate, formatDateForDisplay } from '../../utils/date';
import type { ISODateString } from '../../types/date';

interface DateButtonProps {
    date: ISODateString;
    isSelected: boolean;
    onSelect: (date: ISODateString) => void;
}

export const DateButton = ({ date, isSelected, onSelect }: DateButtonProps) => {
    const dateObj = new Date(date);

    return (
        <button
            onClick={() => onSelect(date)}
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
}; 