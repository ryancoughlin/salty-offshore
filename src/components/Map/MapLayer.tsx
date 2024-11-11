import { Source, Layer } from 'react-map-gl';
import { useMemo, useRef, useCallback, useEffect } from 'react';
import useMapStore from '../../store/useMapStore';
import { BreakInfo } from './BreakInfo';
import { ContourLineLayer } from './ContourLineLayer';
import OceanCurrentAnimation from '../OceanCurrentAnimation';

export const MapLayer: React.FC<{ map: mapboxgl.Map }> = ({ map }) => {
    const {
        layerData,
        loading,
        error,
        selectedRegion,
        selectedDataset,
        selectedDate,
        contourLineInfo,
        setContourLineInfo
    } = useMapStore();
    const hoveredStateId = useRef<string | null>(null);

    const sourceIds = useMemo(() => ({
        data: `${selectedDataset?.id}-data`,
        contours: `${selectedDataset?.id}-contours`,
        image: `${selectedDataset?.id}-image`
    }), [selectedDataset?.id]);

    const handleMouseMove = useCallback((e: mapboxgl.MapLayerMouseEvent) => {
        if (!e.features?.length) return;

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

        setContourLineInfo({
            temperature: e.features[0].properties.value,
            breakStrength: e.features[0].properties.break_strength,
            position: { x: e.point.x, y: e.point.y },
            length_nm: e.features[0].properties.length_nm
        });
    }, [map, sourceIds.contours, setContourLineInfo]);

    const handleMouseLeave = useCallback(() => {
        if (hoveredStateId.current !== null) {
            map.setFeatureState(
                { source: sourceIds.contours, id: hoveredStateId.current },
                { hover: false }
            );
            setContourLineInfo(null);
        }
        hoveredStateId.current = null;
    }, [map, sourceIds.contours, setContourLineInfo]);

    useEffect(() => {
        if (!layerData?.contours) return;

        map.on('mousemove', sourceIds.contours, handleMouseMove);
        map.on('mouseleave', sourceIds.contours, handleMouseLeave);

        return () => {
            map.off('mousemove', sourceIds.contours, handleMouseMove);
            map.off('mouseleave', sourceIds.contours, handleMouseLeave);
        };
    }, [map, sourceIds.contours, handleMouseMove, handleMouseLeave, layerData?.contours]);

    const currentConfig = {
        particleCount: 7000,
        particleLifespan: 60,
        particleColor: '#00ffff',
        speedFactor: 0.15,
        fadeOpacity: true,
        bounds: selectedRegion.bounds
    };

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

            {selectedDataset?.id === 'CMEMS_Global_Currents_Daily' && (
                <OceanCurrentAnimation
                    selectedRegion={selectedRegion}
                    map={map}
                    geoJsonData={layerData.data}
                    config={{
                        particleCount: 5000,
                        particleLifespan: 200,
                        particleColor: "#00ffff",
                        speedFactor: 0.2,
                        fadeOpacity: true,
                        bounds: selectedRegion.bounds
                    }}
                />
            )}

            {contourLineInfo && (
                <BreakInfo info={contourLineInfo} />
            )}
        </>
    );
}; 