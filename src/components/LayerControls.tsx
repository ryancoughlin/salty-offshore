import React from 'react';
import LayerControl from './LayerControl';
import GlobalControls from './GlobalControls';
import type { Region } from '../types/api';
import { useMapStore } from '../store/useMapStore';
import { CATEGORY_NAMES } from '../config';

interface LayerControlsProps {
    region: Region;
}

const LayerControls: React.FC<LayerControlsProps> = ({ region }) => {
    const { selectedDataset, selectDataset } = useMapStore();

    // Group datasets by category
    const datasetsByCategory = region.datasets.reduce((acc, dataset) => {
        const category = dataset.category.toLowerCase();
        if (!acc[category]) acc[category] = [];
        acc[category].push(dataset);
        return acc;
    }, {} as Record<string, typeof region.datasets>);

    return (
        <div className="bg-neutral-950">
            {/* Dataset Selection */}
            {Object.entries(datasetsByCategory).map(([category, datasets]) => (
                <div key={category}>
                    <div className="subtle-heading pl-4 py-2">
                        {CATEGORY_NAMES[category] || category}
                    </div>
                    <div className="flex flex-col">
                        {datasets.map((dataset) => (
                            <LayerControl
                                key={dataset.id}
                                dataset={dataset}
                                isSelected={dataset.id === selectedDataset?.id}
                                onSelect={() => selectDataset(dataset)}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {/* Global Layer Controls */}
            <GlobalControls />
        </div>
    );
};

export default LayerControls;
