import type { LayerState } from '../types/map.types';

interface LayerControlsProps {
    layers: LayerState[];
    onLayerChange: (layerId: string, changes: Partial<LayerState>) => void;
}

const LayerControls = ({ layers, onLayerChange }: LayerControlsProps) => {
    return (
        <div className="layer-controls">
            {layers.map(layer => (
                <div key={layer.id} className="layer-control">
                    <label>
                        <input
                            type="checkbox"
                            checked={layer.visible}
                            onChange={(e) => 
                                onLayerChange(layer.id, { visible: e.target.checked })
                            }
                        />
                        {layer.id}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={layer.opacity}
                        onChange={(e) => 
                            onLayerChange(layer.id, { opacity: parseFloat(e.target.value) })
                        }
                    />
                </div>
            ))}
        </div>
    );
};

export default LayerControls;
