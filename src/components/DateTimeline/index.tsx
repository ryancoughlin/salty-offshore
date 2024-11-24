import { useDateFiltering } from '../../hooks/useDateFiltering';
import type { Dataset } from '../../types/api';
import type { ISODateString } from '../../types/date';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect } from 'react';

interface DateTimelineProps {
    dataset: Dataset;
    selectedDate: ISODateString | null;
    onDateSelect: (date: ISODateString) => void;
}

const formatDate = (dateString: string) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
};

export const DateTimeline = ({
    dataset,
    selectedDate,
    onDateSelect
}: DateTimelineProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dates = useDateFiltering(dataset);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!dates.length) {
        return null;
    }

    const currentIndex = selectedDate ? dates.indexOf(selectedDate) : -1;
    const hasNext = currentIndex > 0;
    const hasPrevious = currentIndex < dates.length - 1;

    const handlePrevious = () => {
        if (hasPrevious) {
            onDateSelect(dates[currentIndex + 1]);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            onDateSelect(dates[currentIndex - 1]);
        }
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="absolute bottom-4 left-4 z-10" ref={dropdownRef}>
            <div className="bg-neutral-900 rounded-lg shadow-lg flex items-center">
                <button
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                    className="p-2 hover:bg-neutral-800 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous date"
                >
                    <ChevronLeftIcon className="h-5 w-5 text-white" />
                </button>
                
                <button
                    onClick={toggleDropdown}
                    className="px-4 py-2 text-white hover:bg-neutral-800 min-w-[180px] text-center"
                >
                    {selectedDate ? formatDate(selectedDate) : 'Select Date'}
                </button>

                <button
                    onClick={handleNext}
                    disabled={!hasNext}
                    className="p-2 hover:bg-neutral-800 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next date"
                >
                    <ChevronRightIcon className="h-5 w-5 text-white" />
                </button>
            </div>

            <div 
                className={`
                    absolute bottom-full mb-2 w-full
                    transform transition-all duration-200 ease-out origin-bottom
                    ${isOpen 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
                `}
            >
                <div className="bg-neutral-900 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                    {dates.map((date) => (
                        <button
                            key={date}
                            onClick={() => {
                                onDateSelect(date);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-neutral-800
                                ${date === selectedDate ? 'bg-blue-500 text-white' : 'text-white'}
                                ${date === dates[0] ? 'rounded-t-lg' : ''}
                                ${date === dates[dates.length - 1] ? 'rounded-b-lg' : ''}
                            `}
                        >
                            {formatDate(date)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};