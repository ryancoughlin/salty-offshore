import React from 'react';
import LayerControl from './LayerControl';
import { CATEGORY_NAMES } from '../config';
import type { Dataset, Region } from '../types/api';
import useMapStore from '../store/useMapStore';

interface LayerControlsProps {
    region: Region;
}

const LayerControls: React.FC<LayerControlsProps> = ({ region }) => {
    const { selectedDataset, selectDataset } = useMapStore();

    const datasetsByCategory = region.datasets.reduce((acc, dataset) => {
        const category = dataset.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(dataset);
        return acc;
    }, {} as Record<string, Dataset[]>);

    return (
        <div className="absolute top-4 right-4 bg-surface-base p-4 rounded shadow-lg">
            {Object.entries(datasetsByCategory).map(([category, datasets]) => (
                <div key={category} className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        {CATEGORY_NAMES[category] || category}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
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
        </div>
    );
};

export default LayerControls;
