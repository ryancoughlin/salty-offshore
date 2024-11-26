import { useState, useCallback } from 'react';
import type { ViewState } from 'react-map-gl';
import { MAP_CONSTANTS } from '../constants/map';

export const useMapViewState = () => {
    const [viewState, setViewState] = useState<Partial<ViewState>>(MAP_CONSTANTS.DEFAULT_VIEW);
    const [cursor, setCursor] = useState<string>('default');

    const handleViewStateChange = useCallback((evt: { viewState: ViewState }) => {
        setViewState(evt.viewState);
    }, []);

    const updateCursor = useCallback((isDistanceTool: boolean) => {
        setCursor(isDistanceTool ? 'crosshair' : 'default');
    }, []);

    return {
        viewState,
        cursor,
        handleViewStateChange,
        updateCursor
    };
}; 