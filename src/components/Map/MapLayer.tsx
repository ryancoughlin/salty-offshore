import { Source, Layer } from 'react-map-gl';
import type { Dataset, Region } from '../../types/api';

interface MapLayerProps {
    region: Region;
    dataset: Dataset;
    visible: boolean;
    selectedDate: string;
    opacity?: number;
}

export const MapLayer: React.FC<MapLayerProps> = ({
    region,
    dataset,
    visible,
    selectedDate,
    opacity = 1
}) => {
    if (!visible) return null;

    const dateEntry = dataset.dates.find(d => d.date === selectedDate);
    if (!dateEntry) return null;

    const layerId = `${dataset.id}-layer`;
    const sourceId = `${dataset.id}-source`;

    const getSourceProps = () => {
        if (dataset.type === 'image') {
            return {
                type: 'image' as const,
                url: dateEntry.url,
                coordinates: region.bounds
            };
        }
        return {
            type: 'geojson' as const,
            data: dateEntry.url
        };
    };

    const getLayerProps = () => {
        if (dataset.type === 'image') {
            return {
                type: 'raster' as const,
                paint: {
                    'raster-opacity': opacity,
                    'raster-fade-duration': 0
                }
            };
        }
        return {
            type: 'line' as const,
            paint: {
                'line-color': '#FF0000',
                'line-width': 1,
                'line-opacity': opacity
            }
        };
    };

    return (
        <Source
            id={sourceId}
            {...getSourceProps()}
        >
            <Layer
                id={layerId}
                {...getLayerProps()}
            />
        </Source>
    );
}; 