import { useState, useEffect, useCallback, useRef } from 'react';
import type { RegionInfo } from '../../types/api';
import usePersistedState from '../../hooks/usePersistedState';
import { RegionSelectItem } from './RegionSelectItem';

export const RegionPicker: React.FC<RegionPickerProps> = ({
    regions,
    selectedRegion,
    onRegionSelect
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [persistedRegionId, setPersistedRegionId] = usePersistedState<string>('selectedRegionId', '');

    const handleRegionSelect = useCallback((region: RegionInfo) => {
        setPersistedRegionId(region.id);
        onRegionSelect(region);
        setIsOpen(false);
    }, [setPersistedRegionId, onRegionSelect]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-[86px] px-6 bg-neutral-950 border-r border-white/20 text-white text-2xl font-semibold justify-center items-center gap-2 inline-flex transition-colors duration-150 ease-in-out hover:bg-white/5"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                {selectedRegion?.name || 'Select a region'}
                <svg
                    className={`w-5 h-5 transition-transform duration-150 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`
                    absolute top-full left-0 w-full bg-neutral-950 z-50
                    transition-all duration-150 ease-in-out origin-top
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                `}
                role="listbox"
            >
                {regions.map(region => (
                    <RegionSelectItem
                        key={region.id}
                        name={region.name}
                        selected={region.id === selectedRegion?.id}
                        onClick={() => handleRegionSelect(region)}
                    />
                ))}
            </div>
        </div>
    );
}; 