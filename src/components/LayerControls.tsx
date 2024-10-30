import React from 'react';
import LayerControl from './LayerControl';
import { CATEGORY_NAMES } from '../config';
import type { Dataset, Region } from '../types/api';
import type { DatasetId } from '../types/Layer';

interface LayerControlsProps {
    region: Region;
    visibleLayers: Set<string>;
    onToggleLayer: (datasetId: DatasetId, layerType?: string) => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({
    region,
    visibleLayers,
    onToggleLayer
}) => {
    // Group datasets by category
    const datasetsByCategory = region.datasets.reduce((acc, dataset) => {
        const category = dataset.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(dataset);
        return acc;
    }, {} as Record<string, Dataset[]>);

    return (
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-lg">
            {Object.entries(datasetsByCategory).map(([category, datasets]) => (
                <div key={category} className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        {CATEGORY_NAMES[category] || category}
                    </h3>
                    <div className="space-y-2">
                        {datasets.map((dataset) => (
                            <LayerControl
                                key={dataset.id}
                                dataset={dataset}
                                visible={visibleLayers.has(dataset.id)}
                                visibleLayers={visibleLayers}
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
