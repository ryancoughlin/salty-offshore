import React from 'react';
import type { Region } from '../types/api';
import useMapStore from '../store/useMapStore';
import LayerControl from './LayerControl';
import { getDatasetConfig } from '../types/datasets';

interface LayerControlsProps {
    region: Region;
}

const LayerControls: React.FC<LayerControlsProps> = ({ region }) => {
    const { selectedDataset, selectDataset } = useMapStore();

    // Group datasets by SST and Other
    const sstDatasets = region.datasets.filter(dataset =>
        dataset.category.toLowerCase() === 'sst'
    );
    const otherDatasets = region.datasets.filter(dataset =>
        dataset.category.toLowerCase() !== 'sst'
    );

    return (
        <div className="bg-neutral-950">
            {/* SST Datasets */}
            {sstDatasets.length > 0 && (
                <div>
                    <div className="subtle-heading pl-4 py-2">
                        SEA SURFACE TEMPERATURE
                    </div>
                    <div className="flex flex-col">
                        {sstDatasets.map((dataset) => (
                            <LayerControl
                                key={dataset.id}
                                dataset={dataset}
                                config={dataset.id === selectedDataset?.id ? getDatasetConfig(dataset.id) : undefined}
                                isSelected={dataset.id === selectedDataset?.id}
                                onSelect={() => selectDataset(dataset)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Datasets */}
            {otherDatasets.length > 0 && (
                <div>
                    <div className="subtle-heading pl-4 py-2">
                        OTHER
                    </div>
                    <div className="flex flex-col">
                        {otherDatasets.map((dataset) => (
                            <LayerControl
                                key={dataset.id}
                                dataset={dataset}
                                config={dataset.id === selectedDataset?.id ? getDatasetConfig(dataset.id) : undefined}
                                isSelected={dataset.id === selectedDataset?.id}
                                onSelect={() => selectDataset(dataset)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LayerControls;
