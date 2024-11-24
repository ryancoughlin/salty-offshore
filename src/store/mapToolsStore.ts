import { create } from 'zustand';
import { nanoid } from 'nanoid';
import * as turf from '@turf/turf';

export type Point = {
  id: string;
  coordinates: [number, number];
};

export type Path = {
  id: string;
  points: Point[];
  distances: number[];
  totalDistance: number;
  isComplete: boolean;
};

interface MapToolsState {
  isToolActive: boolean;
  activeTool: 'distance' | null;
  paths: Path[];
  currentPath: Path | null;
  mousePosition: [number, number] | null;
  draggedPointId: string | null;
  isPathComplete: boolean;
  
  // Actions
  activateDistanceTool: () => void;
  deactivateTools: () => void;
  addPoint: (coordinates: [number, number]) => void;
  updateMousePosition: (coordinates: [number, number] | null) => void;
  completePath: () => void;
  clearPaths: () => void;
  deletePath: (pathId: string) => void;
  startDraggingPoint: (pointId: string) => void;
  stopDraggingPoint: () => void;
  updatePointPosition: (coordinates: [number, number]) => void;
}

const calculateDistances = (points: Point[]): { segments: number[], total: number } => {
  if (points.length < 2) return { segments: [], total: 0 };
  
  const segments = points.slice(1).map((point, i) => {
    const from = turf.point(points[i].coordinates);
    const to = turf.point(point.coordinates);
    // Convert kilometers to miles
    return turf.distance(from, to, { units: 'kilometers' }) * 0.621371;
  });
  
  return {
    segments,
    total: segments.reduce((sum, dist) => sum + dist, 0)
  };
};

export const useMapToolsStore = create<MapToolsState>((set, get) => ({
  isToolActive: false,
  activeTool: null,
  paths: [],
  currentPath: null,
  mousePosition: null,
  draggedPointId: null,
  isPathComplete: false,

  activateDistanceTool: () => set({ 
    isToolActive: true, 
    activeTool: 'distance',
    currentPath: null,
    mousePosition: null 
  }),
  
  deactivateTools: () => set({ 
    isToolActive: false, 
    activeTool: null, 
    currentPath: null,
    mousePosition: null,
    draggedPointId: null
  }),

  addPoint: (coordinates) => {
    const { currentPath } = get();
    if (!currentPath) {
      set({ 
        currentPath: { 
          id: nanoid(), 
          points: [{ id: nanoid(), coordinates }],
          distances: [],
          totalDistance: 0,
          isComplete: false
        }
      });
      return;
    }

    const updatedPoints = [...currentPath.points, { id: nanoid(), coordinates }];
    const { segments, total } = calculateDistances(updatedPoints);
    
    set({
      currentPath: {
        ...currentPath,
        points: updatedPoints,
        distances: segments,
        totalDistance: total
      }
    });
  },

  updateMousePosition: (coordinates) => set({ mousePosition: coordinates }),

  completePath: () => {
    const { currentPath, paths } = get();
    if (currentPath && currentPath.points.length > 1) {
      const completedPath = { ...currentPath, isComplete: true };
      set({
        paths: [...paths, completedPath],
        isPathComplete: true,
        currentPath: null,
      });
    }
  },

  clearPaths: () => set({ paths: [], currentPath: null }),
  
  deletePath: (pathId) => {
    const { paths } = get();
    set({ paths: paths.filter(path => path.id !== pathId) });
  },

  startDraggingPoint: (pointId: string) => set({ draggedPointId: pointId }),
  
  stopDraggingPoint: () => set({ draggedPointId: null }),

  updatePointPosition: (coordinates) => {
    const { draggedPointId, currentPath, paths } = get();
    if (!draggedPointId) return;

    // Update point in current path
    if (currentPath) {
      const pointIndex = currentPath.points.findIndex(p => p.id === draggedPointId);
      if (pointIndex >= 0) {
        const updatedPoints = [...currentPath.points];
        updatedPoints[pointIndex] = { ...updatedPoints[pointIndex], coordinates };
        const { segments, total } = calculateDistances(updatedPoints);
        set({
          currentPath: {
            ...currentPath,
            points: updatedPoints,
            distances: segments,
            totalDistance: total
          }
        });
        return;
      }
    }

    // Update point in completed paths
    const updatedPaths = paths.map(path => {
      const pointIndex = path.points.findIndex(p => p.id === draggedPointId);
      if (pointIndex >= 0) {
        const updatedPoints = [...path.points];
        updatedPoints[pointIndex] = { ...updatedPoints[pointIndex], coordinates };
        const { segments, total } = calculateDistances(updatedPoints);
        return {
          ...path,
          points: updatedPoints,
          distances: segments,
          totalDistance: total
        };
      }
      return path;
    });
    set({ paths: updatedPaths });
  },
})); 