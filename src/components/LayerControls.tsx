import React from 'react';
import LayerControl from './LayerControl';
import type { Region } from '../types/api';
import useMapStore from '../store/useMapStore';

interface LayerControlsProps {
    region: Region;
}

const LayerControls: React.FC<LayerControlsProps> = ({ region }) => {
    const { selectedDataset, selectDataset } = useMapStore();

    const sstDatasets = region.datasets.filter(dataset => 
        dataset.category.toLowerCase().includes('sst')
    );
    
    const otherDatasets = region.datasets.filter(dataset => 
        !dataset.category.toLowerCase().includes('sst')
    );

    return (
        <div className="bg-neutral-950">
            {sstDatasets.length > 0 && (
                <div>
                    <div className="subtle-heading pl-4 py-2">
                        Water Temperature
                    </div>
                    <div className="flex flex-col">
                        {sstDatasets.map((dataset) => (
                            <LayerControl
                                key={dataset.id}
                                dataset={dataset}
                                isSelected={dataset.id === selectedDataset?.id}
                                onSelect={() => selectDataset(dataset)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {otherDatasets.length > 0 && (
                <div>
                    <div className="subtle-heading pl-4 py-2">
                        Other
                    </div>
                    <div className="flex flex-col">
                        {otherDatasets.map((dataset) => (
                            <LayerControl
                                key={dataset.id}
                                dataset={dataset}
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
