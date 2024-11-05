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
        <div className="bg-neutral-950 pl-6 pr-0">
            {Object.entries(datasetsByCategory).map(([category, datasets]) => (
                <div key={category} className="mb-4">
                    <span className="text-xs font-semibold text-neutral-50 mb-1">
                        {CATEGORY_NAMES[category] || category}
                    </span>
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
        </div>
    );
};

export default LayerControls;
