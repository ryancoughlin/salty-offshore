import { useState } from 'react';
import { formatCoordinates } from '../../utils/formatCoordinates';
import type { Coordinate } from '../../types/core';

interface GeographicInspectorProps {
    mapRef: mapboxgl.Map | null;
    cursorPosition: Coordinate | null;
}

export const GeographicInspector: React.FC<GeographicInspectorProps> = ({
    mapRef,
    cursorPosition
}) => {
    const [format, setFormat] = useState<'DD' | 'DMS' | 'DMM'>('DMS');

    const formattedCoordinates = cursorPosition && Array.isArray(cursorPosition) && cursorPosition.length === 2
        ? formatCoordinates(cursorPosition, format)
        : 'N/A';

    const handleFormatChange = () => {
        setFormat(f => f === 'DD' ? 'DMS' : f === 'DMS' ? 'DMM' : 'DD');
    };

    return (
        <div className="flex flex-col justify-center items-start flex-grow-0 flex-shrink-0 relative gap-2">
            <span className="flex-grow-0 flex-shrink-0 opacity-50 text-sm font-medium text-left uppercase text-white">
                Location
            </span>
            <span
                className="flex-grow-0 flex-shrink-0 text-[28px] font-semibold text-left text-white"
                onClick={handleFormatChange}
                onKeyDown={(e) => e.key === 'Enter' && handleFormatChange()}
                role="button"
                tabIndex={0}
                aria-label={`Location coordinates: ${formattedCoordinates}. Click to change format.`}
            >
                {formattedCoordinates}
            </span>
        </div>
    );
};  