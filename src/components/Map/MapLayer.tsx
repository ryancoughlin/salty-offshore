import { Source, Layer } from 'react-map-gl';
import { useMemo, useRef, useEffect } from 'react';
import useMapStore from '../../store/useMapStore';
import { BreakInfo } from './BreakInfo';
import { ContourLineLayer } from './ContourLineLayer';

export const MapLayer: React.FC<{ map: mapboxgl.Map }> = ({ map }) => {
    const { layerData, loading, error, selectedRegion, selectedDataset, selectedDate, contourLineInfo, setContourLineInfo } = useMapStore();
    const hoveredStateId = useRef<string | null>(null);

    const sourceIds = useMemo(() => ({
        data: `${selectedDataset?.id}-data`,
        contours: `${selectedDataset?.id}-contours`,
        image: `${selectedDataset?.id}-image`
    }), [selectedDataset?.id]);

    useEffect(() => {
        if (!layerData?.contours) return;

        // Add mouse events to the contour layer
        map.on('mousemove', sourceIds.contours, (e) => {
            if (e.features?.length) {
                if (hoveredStateId.current !== null) {
                    map.setFeatureState(
                        { source: sourceIds.contours, id: hoveredStateId.current },
                        { hover: false }
                    );
                }

                hoveredStateId.current = e.features[0].id as string;
                map.setFeatureState(
                    { source: sourceIds.contours, id: hoveredStateId.current },
                    { hover: true }
                );

                // Update hover info for BreakInfo component
                setContourLineInfo({
                    temperature: e.features[0].properties.value,
                    breakStrength: e.features[0].properties.break_strength,
                    position: { x: e.point.x, y: e.point.y }
                });
            }
        });

        map.on('mouseleave', sourceIds.contours, () => {
            if (hoveredStateId.current !== null) {
                map.setFeatureState(
                    { source: sourceIds.contours, id: hoveredStateId.current },
                    { hover: false }
                );
                setContourLineInfo(null);
            }
            hoveredStateId.current = null;
        });

        return () => {
            map.off('mousemove', sourceIds.contours);
            map.off('mouseleave', sourceIds.contours);
        };
    }, [layerData?.contours, map, sourceIds.contours, setContourLineInfo]);

    if (!selectedDataset || !selectedRegion || !selectedDate || loading || error || !layerData) {
        return null;
    }

    return (
        <>
            {layerData.data && (
                <Source
                    key={`${sourceIds.data}-source`}
                    id={sourceIds.data}
                    type="geojson"
                    data={layerData.data}
                >
                    <Layer
                        id={sourceIds.data}
                        type="fill"
                        paint={{
                            'fill-opacity': 0,
                            'fill-color': '#007cbf'
                        }}
                    />
                </Source>
            )}

            {layerData.image && (
                <Source
                    key={`${sourceIds.image}-source`}
                    id={sourceIds.image}
                    type="image"
                    url={layerData.image}
                    coordinates={[
                        [selectedRegion.bounds[0][0], selectedRegion.bounds[1][1]],
                        [selectedRegion.bounds[1][0], selectedRegion.bounds[1][1]],
                        [selectedRegion.bounds[1][0], selectedRegion.bounds[0][1]],
                        [selectedRegion.bounds[0][0], selectedRegion.bounds[0][1]]
                    ]}
                >
                    <Layer
                        id={sourceIds.image}
                        type="raster"
                        paint={{
                            'raster-opacity': 1,
                            'raster-fade-duration': 0
                        }}
                    />
                </Source>
            )}

            {selectedDataset?.id === 'LEOACSPOSSTL3SnrtCDaily' && (
                <ContourLineLayer sourceIds={sourceIds} />
            )}

            {contourLineInfo && (
                <BreakInfo info={contourLineInfo} />
            )}
        </>
    );
}; 