import { memo, useEffect, useState } from 'react';
import { ScaleControl, useMap } from 'react-map-gl';
import { Plus, Minus } from 'lucide-react';

const CustomZoomControl = () => {
    const { current: map } = useMap();
    const [zoom, setZoom] = useState(map?.getZoom() ?? 0);
    const maxZoom = map?.getMaxZoom() ?? 20;
    const minZoom = map?.getMinZoom() ?? 0;

    useEffect(() => {
        if (!map) return;

        const onZoom = () => {
            setZoom(map.getZoom());
        };

        map.on('zoom', onZoom);
        return () => {
            map.off('zoom', onZoom);
        };
    }, [map]);

    const handleZoomIn = () => {
        map?.zoomIn();
    };

    const handleZoomOut = () => {
        map?.zoomOut();
    };

    if (!map) return null;

    const isMaxZoom = zoom >= maxZoom;
    const isMinZoom = zoom <= minZoom;

    return (
        <div className="absolute top-3 right-3 flex flex-col" style={{ filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.25))" }}>
            <button
                onClick={handleZoomIn}
                disabled={isMaxZoom}
                className="group h-14 w-12 flex items-center justify-center rounded-t-[56px] bg-white hover:bg-neutral-50 transition-colors border-b border-black/10 disabled:cursor-not-allowed disabled:hover:bg-white"
                aria-label="Zoom in"
            >
                <Plus className="w-6 h-6 transition-opacity group-disabled:opacity-30" />
            </button>
            <button
                onClick={handleZoomOut}
                disabled={isMinZoom}
                className="group h-14 w-12 flex items-center justify-center rounded-b-[56px] bg-white hover:bg-neutral-50 transition-colors disabled:cursor-not-allowed disabled:hover:bg-white"
                aria-label="Zoom out"
            >
                <Minus className="w-6 h-6 transition-opacity group-disabled:opacity-30" />
            </button>
        </div>
    );
};

export const MapControls = memo(() => (
    <>
        <CustomZoomControl />
        <ScaleControl maxWidth={100} unit="nautical" position="bottom-left" />
    </>
));

MapControls.displayName = 'MapControls'; 