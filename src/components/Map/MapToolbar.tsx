import { memo, useEffect } from 'react';
import { Ruler, X, Check, Trash2 } from 'lucide-react';
import { DateTimeline } from '../DateTimeline';
import { useMapToolsStore } from '../../store/mapToolsStore';
import type { Dataset } from '../../types/api';
import type { ISODateString } from '../../types/date';

interface MapToolbarProps {
    dataset?: Dataset;
    selectedDate: ISODateString | null;
    onDateSelect: (date: ISODateString) => void;
}

export const MapToolbar = memo(({ dataset, selectedDate, onDateSelect }: MapToolbarProps) => {
    const {
        toggleTool,
        activeTool,
        paths,
        completePath,
        clearPaths,
        currentPath,
    } = useMapToolsStore();

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeTool) return;

            switch (e.key) {
                case 'Escape':
                    toggleTool('distance');
                    break;
                case 'Enter':
                    if (activeTool === 'distance' && currentPath?.points?.length) {
                        completePath();
                        toggleTool('distance');
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTool, toggleTool, completePath, currentPath]);

    const handleCompletePath = () => {
        if (currentPath?.points?.length) {
            completePath();
            toggleTool('distance');
        }
    };

    return (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {dataset && (
                    <DateTimeline
                        dataset={dataset}
                        selectedDate={selectedDate}
                        onDateSelect={onDateSelect}
                    />
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex items-center gap-2">
                    {paths.length > 0 && (
                        <button
                            onClick={clearPaths}
                            className="group h-12 px-4 flex items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-lg text-sm font-medium gap-2"
                            aria-label="Clear all measurements"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear All</span>
                        </button>
                    )}

                    {activeTool === 'distance' && currentPath?.points?.length > 0 && (
                        <button
                            onClick={handleCompletePath}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 group h-12 w-12 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg"
                            aria-label="Complete measurement"
                        >
                            <Check className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={() => toggleTool('distance')}
                        className={`
                            group h-12 w-12 flex items-center justify-center rounded-full
                            transition-all duration-200 shadow-lg
                            ${activeTool === 'distance'
                                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                                : 'bg-white text-neutral-900 hover:bg-neutral-50'
                            }
                        `}
                        aria-label={activeTool === 'distance' ? "Cancel measurement" : "Measure distance"}
                    >
                        {activeTool === 'distance' ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Ruler className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
});

MapToolbar.displayName = 'MapToolbar'; 