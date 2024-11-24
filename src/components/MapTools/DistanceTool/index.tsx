import React, { useCallback } from 'react';
import type { Path, Point } from '../../../store/mapToolsStore';
import { useMapToolsStore } from '../../../store/mapToolsStore';
import { DistanceLine } from './DistanceLine';
import { TotalDistanceLabel } from './TotalDistanceLabel';
import { CustomMarker } from './CustomMarker';

export const DistanceTool: React.FC = () => {
  const {
    currentPath,
    paths,
    mousePosition,
    isToolActive,
    activeTool,
    startDraggingPoint,
    stopDraggingPoint,
    updatePointPosition,
  } = useMapToolsStore();

  const handleDragStart = useCallback((pointId: string) => {
    startDraggingPoint(pointId);
  }, [startDraggingPoint]);

  const handleDragEnd = useCallback(() => {
    stopDraggingPoint();
  }, [stopDraggingPoint]);

  const renderPath = (path: Path, isCurrent: boolean = false) => (
    <React.Fragment key={path.id}>
      {path.points.length >= 2 && (
        <>
          <DistanceLine 
            points={path.points.map((p: Point) => p.coordinates)} 
            lineId={`${path.id}-${isCurrent ? 'current' : 'main'}`}
          />
          <TotalDistanceLabel
            points={path.points.map((p: Point) => p.coordinates)}
            totalDistance={path.totalDistance}
          />
        </>
      )}
      {path.points.map((point: Point, index: number) => (
        <CustomMarker
          key={point.id}
          coordinates={point.coordinates}
          type={index === 0 ? 'start' : index === path.points.length - 1 ? 'end' : 'point'}
          isDraggable
          onDragStart={() => handleDragStart(point.id)}
          onDrag={(coords) => updatePointPosition(coords)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </React.Fragment>
  );

  if (!isToolActive || activeTool !== 'distance') {
    return null;
  }

  return (
    <>
      {paths.map((path) => renderPath(path))}
      {currentPath && (
        <>
          {renderPath(currentPath, true)}
          {mousePosition && currentPath.points.length > 0 && (
            <DistanceLine
              points={[
                currentPath.points[currentPath.points.length - 1].coordinates,
                mousePosition
              ]}
              isTemporary
              lineId={`${currentPath.id}-temp`}
            />
          )}
        </>
      )}
    </>
  );
}; 