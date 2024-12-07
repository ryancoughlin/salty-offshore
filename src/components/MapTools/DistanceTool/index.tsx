import React from 'react';
import { useMapToolsStore } from '../../../store/mapToolsStore';
import type { Path } from '../../../store/mapToolsStore';
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

  const renderPath = (path: Path, isCurrent = false) => {
    if (!path.points.length) return null;

    return (
      <React.Fragment key={path.id}>
        {path.points.length >= 2 && (
          <>
            <DistanceLine
              points={path.points.map(p => p.coordinates)}
              lineId={`${path.id}-${isCurrent ? 'current' : 'main'}`}
            />
            <TotalDistanceLabel
              points={path.points.map(p => p.coordinates)}
              totalDistance={path.totalDistance}
            />
          </>
        )}
        {path.points.map((point, index) => (
          <CustomMarker
            key={point.id}
            coordinates={point.coordinates}
            type={index === 0 ? 'start' : index === path.points.length - 1 ? 'end' : 'point'}
            isDraggable
            onDragStart={() => startDraggingPoint(point.id)}
            onDrag={(coords) => updatePointPosition(coords)}
            onDragEnd={stopDraggingPoint}
          />
        ))}
      </React.Fragment>
    );
  };

  const renderTemporaryLine = () => {
    if (!mousePosition || !currentPath?.points.length) return null;

    return (
      <DistanceLine
        points={[
          currentPath.points[currentPath.points.length - 1].coordinates,
          mousePosition
        ]}
        isTemporary
        lineId={`${currentPath.id}-temp`}
      />
    );
  };

  return (
    <>
      {/* Completed paths are always visible */}
      {paths.map(path => renderPath(path))}

      {/* Current path and temporary line only visible in measure mode */}
      {isToolActive && activeTool === 'distance' && currentPath && (
        <>
          {renderPath(currentPath, true)}
          {renderTemporaryLine()}
        </>
      )}
    </>
  );
}; 