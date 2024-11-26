import { memo } from 'react';
import { NavigationControl, ScaleControl } from 'react-map-gl';

export const MapControls = memo(() => (
    <>
        <NavigationControl position="top-right" />
        <ScaleControl maxWidth={100} unit="nautical" position="bottom-left" />
    </>
));

MapControls.displayName = 'MapControls'; 