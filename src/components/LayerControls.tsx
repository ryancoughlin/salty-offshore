import React from 'react';
import LayerControl from './LayerControl';
import type { Region } from '../types/api';
import type { DataCategory } from '../types/core';

interface LayerControlsProps {
    region: Region;
    visibleLayers: Set<string>;
    onToggleLayer: (datasetId: string) => void;
}

const categoryLabels: Record<DataCategory, string> = {
    sst: 'Sea Surface Temperature',
    currents: 'Ocean Currents',
    chlorophyll: 'Chlorophyll'
};

const LayerControls: React.FC<LayerControlsProps> = ({
    region,
    visibleLayers,
    onToggleLayer
}) => {
    // Group datasets by category
    const groupedDatasets = region.datasets.reduce((acc, dataset) => {
        if (!acc[dataset.category]) {
            acc[dataset.category] = [];
        }
        acc[dataset.category].push(dataset);
        return acc;
    }, {} as Record<DataCategory, typeof region.datasets>);

    return (
        <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-2">
            {Object.entries(groupedDatasets).map(([category, datasets]) => (
                <div key={category} className="mb-4 last:mb-0">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">
                        {categoryLabels[category as DataCategory]}
                    </h3>
                    <div className="space-y-1">
                        {datasets.map(dataset => (
                            <LayerControl
                                key={dataset.id}
                                dataset={dataset}
                                visible={visibleLayers.has(dataset.id)}
                                onToggle={() => onToggleLayer(dataset.id)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LayerControls;
