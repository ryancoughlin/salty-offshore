import { useState } from 'react';
import { formatCoordinates } from '../../utils/formatCoordinates';
import type { Coordinate } from '../../types/core';

interface GeographicInspectorProps {
    cursorPosition: Coordinate | null;
}

export const GeographicInspector: React.FC<GeographicInspectorProps> = ({
    cursorPosition
}) => {
    const [format, setFormat] = useState<'DD' | 'DMS' | 'DMM'>('DMS');

    const formattedCoordinates = cursorPosition
        ? formatCoordinates([
            Number(cursorPosition.longitude),
            Number(cursorPosition.latitude.toFixed(3))
        ], format)
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