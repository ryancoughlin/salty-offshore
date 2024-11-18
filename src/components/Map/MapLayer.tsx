import { memo, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import useMapStore from '../../store/useMapStore';
import { BreakInfo } from './BreakInfo';

// Memoize static layer configurations
const baseLayer = {
    id: 'data-layer',
    type: 'fill' as const,
    paint: {
        'fill-opacity': 0,
        'fill-color': '#007cbf'
    }
};

const imageLayer = {
    id: 'image-layer',
    type: 'raster' as const,
    paint: {
        'raster-opacity': 1,
        'raster-fade-duration': 0
    }
};

const contourLayer = {
    id: 'contour-layer',
    type: 'line' as const,
    paint: {
        'line-color': ['interpolate',
            ['linear'],
            ['get', 'value'],
            44, '#356b95',
            54, '#89d0e4',
            56, '#b1e095',
            58, '#ebf66b',
            60, '#ffee4f',
            65, '#fdaa1c',
            70, '#e05a08',
            72, '#cc3f0b',
            75, '#9f2815'
        ],
        'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            ['match', ['get', 'break_strength'],
                'strong', 3,
                'moderate', 2,
                1
            ]
        ],
        'line-opacity': 1
    }
};

interface MapLayerProps {
    map: mapboxgl.Map;
}

interface ContourLineInfo {
    temperature: number;
    breakStrength: 'strong' | 'moderate' | 'weak';
    position: { x: number; y: number };
    length_nm: number;
}

export const MapLayer = memo<MapLayerProps>(({ map }) => {
    const { layerData, selectedRegion } = useMapStore();
    const [contourLineInfo, setContourLineInfo] = useState<ContourLineInfo | null>(null);

    useEffect(() => {
        if (!map) return;

        const handleMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
            if (!e.features?.[0]) return;
            const feature = e.features[0];
            setContourLineInfo({
                temperature: feature.properties.value,
                breakStrength: feature.properties.break_strength ?? 'weak',
                position: { x: e.point.x, y: e.point.y },
                length_nm: feature.properties.length_nm ?? 0
            });
        };

        const handleMouseLeave = () => {
            setContourLineInfo(null);
        };

        map.on('mousemove', 'contour-layer', handleMouseMove);
        map.on('mouseleave', 'contour-layer', handleMouseLeave);

        return () => {
            map.off('mousemove', 'contour-layer', handleMouseMove);
            map.off('mouseleave', 'contour-layer', handleMouseLeave);
        };
    }, [map]);

    if (!layerData || !selectedRegion) return null;

    return (
        <>
            {/* Base data layer */}
            <Source type="geojson" data={layerData.data}>
                <Layer {...baseLayer} />
            </Source>

            {/* Image layer */}
            {layerData.image && (
                <Source 
                    type="image" 
                    url={layerData.image}
                    coordinates={[
                        [selectedRegion.bounds[0][0], selectedRegion.bounds[1][1]],
                        [selectedRegion.bounds[1][0], selectedRegion.bounds[1][1]],
                        [selectedRegion.bounds[1][0], selectedRegion.bounds[0][1]],
                        [selectedRegion.bounds[0][0], selectedRegion.bounds[0][1]]
                    ]}
                >
                    <Layer {...imageLayer} />
                </Source>
            )}

            {/* Contour lines layer */}
            {layerData.contours && (
                <Source 
                    type="geojson" 
                    data={layerData.contours}
                    generateId={true}
                >
                    <Layer {...contourLayer} />
                </Source>
            )}

            {/* Hover info */}
            {contourLineInfo && <BreakInfo info={contourLineInfo} />}
        </>
    );
});

MapLayer.displayName = 'MapLayer'; 