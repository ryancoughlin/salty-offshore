import { RegionImage } from '../RegionPicker/RegionImage';
import type { Region } from '../../types/api';

interface AccountRegionSelectProps {
    label?: string;
    helperText?: string;
    regions: Region[];
    value: string | null;
    onChange: (value: string | null) => void;
    className?: string;
}

export const AccountRegionSelect = ({
    label,
    helperText,
    regions,
    value,
    onChange,
    className
}: AccountRegionSelectProps) => {
    const selectId = label?.toLowerCase().replace(/\s+/g, '-');
    const selectedRegion = value ? regions.find(r => r.id === value) : null;

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-label text-white"
                >
                    {label}
                </label>
            )}
            <div className={`relative p-3 bg-neutral-950/90 border border-neutral-700 flex justify-between items-center
                group hover:border-neutral-600 ${className || ''}`}
            >
                <div className="flex items-center gap-4 w-full pointer-events-none">
                    {selectedRegion && (
                        <RegionImage
                            thumbnail={selectedRegion.thumbnail}
                            name={selectedRegion.name}
                        />
                    )}
                    <span className={`text-body ${value ? 'text-white' : 'text-neutral-500'}`}>
                        {selectedRegion?.name || 'Select a region'}
                    </span>
                </div>
                <div className="text-white opacity-50 pointer-events-none">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <select
                    id={selectId}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <option value="">Select a region</option>
                    {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                            {region.name}
                        </option>
                    ))}
                </select>
            </div>
            {helperText && (
                <p className="text-helper">
                    {helperText}
                </p>
            )}
        </div>
    );
}; 