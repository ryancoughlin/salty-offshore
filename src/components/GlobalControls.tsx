import React from 'react';
import { useLayerStore } from '../store/useLayerStore';

const GlobalControls: React.FC = () => {
    const { layerSettings, toggleLayer, setLayerOpacity } = useLayerStore();
    const gridSettings = layerSettings.get('grid');

    if (!gridSettings) return null;

    return (
        <div className="border-t border-white/10 mt-4">
            <div className="subtle-heading pl-4 py-2">
                Global Controls
            </div>
            <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm text-white">
                        Grid
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={gridSettings.visible}
                            onChange={() => toggleLayer('grid')}
                            className="rounded border-white/20"
                        />
                        {gridSettings.visible && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={gridSettings.opacity}
                                    onChange={(e) => setLayerOpacity('grid', parseFloat(e.target.value))}
                                    className="w-24"
                                />
                                <span className="text-xs text-white/60 w-8">
                                    {Math.round(gridSettings.opacity * 100)}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalControls; 