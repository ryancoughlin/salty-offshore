import React from 'react';
import LayerControl from './LayerControl';
import type { LayerGroups, LayerCategory, DatasetId } from '../types/Layer';

interface LayerControlsProps {
    layerGroups: LayerGroups;
    onToggleLayer: (datasetId: DatasetId) => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({ 
    layerGroups, 
    onToggleLayer 
}) => {
    // Category labels for display
    const categoryLabels: Record<LayerCategory, string> = {
        sst: 'Sea Surface Temperature',
        currents: 'Ocean Currents',
        chlorophyll: 'Chlorophyll'
    };

    return (
        <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-2">
            {(Object.keys(layerGroups) as LayerCategory[]).map(category => (
                <div key={category} className="mb-4 last:mb-0">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">
                        {categoryLabels[category]}
                    </h3>
                    <div className="space-y-1">
                        {layerGroups[category].map(layer => (
                            <LayerControl
                                key={layer.id}
                                id={layer.id}
                                name={layer.name}
                                visible={layer.visible}
                                onToggle={onToggleLayer}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LayerControls;
