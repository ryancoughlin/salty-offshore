import { useMapToolsStore } from '../../../store/mapToolsStore';

export const MeasurementHelper = () => {
    const { activeTool, currentPath } = useMapToolsStore();

    if (activeTool !== 'distance') return null;

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            {!currentPath?.points.length ? (
                <div className="flex items-center gap-2">
                    <span>Click anywhere to start measuring</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Esc</kbd>
                    <span>to cancel</span>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span>Click to add points</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Enter</kbd>
                    <span>to complete</span>
                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Esc</kbd>
                    <span>to cancel</span>
                </div>
            )}
        </div>
    );
}; 