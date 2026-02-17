import { stageRef } from "@/stores/stageRef";
import type { PenSettings, ShapeSettings } from "@/stores/useAppStore";
import type { MapElement } from "@/types/MapElement";

// Convert current pointer position to stage coordinates, accounting for zoom and pan
export const getStageCoords = (mapSide: string, imageSize: { width: number; height: number }): { x: number; y: number } => {
  const stage = stageRef.current;
  if (!stage) return { x: 0, y: 0 };

  const pos = stage.getPointerPosition();
  if (!pos) return { x: 0, y: 0 };

  // First: convert screen coords to canvas coords
  const coords = {
    x: (pos.x - stage.x()) / stage.scaleX(),
    y: (pos.y - stage.y()) / stage.scaleY(),
  };

  // Then: flip to canonical space if on Defense
  if (mapSide === "Defense") {
    coords.x = imageSize.width - coords.x;
    coords.y = imageSize.height - coords.y;
  }

  return coords;
};


const BASE_BRUSH_SIZE = 16;

export const scaleDashPattern = (dashPattern: number[], brushSize: number) => {
  const factor = brushSize / BASE_BRUSH_SIZE;
  return dashPattern.map(value => value * factor);
}

export const createLineElement = (
  penSettings: PenSettings,
  pos: { x: number; y: number },
  isStraightLine: boolean
): MapElement => {
  const {brushType, brushSize, color, opacity, dashPattern, pointer} = penSettings;

  const isArrow = brushType === "arrow" || brushType === "dashedArrow";
  const isDashed = brushType === "dashedLine" || brushType === "dashedArrow";

  const scaleFactor = brushSize / BASE_BRUSH_SIZE;

  return {
    id: `${isArrow ? "arrow" : "line"}-${Date.now()}`,
    type: isArrow ? "arrow" : "line",
    points: isStraightLine ? [pos.x, pos.y, pos.x, pos.y] : [pos.x, pos.y],
    color,
    strokeWidth: brushSize,
    dash: isDashed ? scaleDashPattern(dashPattern, brushSize) : undefined,
    pointerLength: isArrow ? Math.max(5, pointer.length * scaleFactor) : undefined,
    pointerWidth: isArrow ? Math.max(5, pointer.width * scaleFactor) : undefined,
    opacity,
  };
};

export const createShapeElement = (
  shapeSettings: ShapeSettings,
  pos: { x: number; y: number },
  type: "rectangle" | "circle"
): MapElement => {
  const { strokeWidth, color, fill, borderRadius, opacity, dashPattern } = shapeSettings;

  return {
    id: `${type}-${Date.now()}`,
    type,
    x: pos.x,
    y: pos.y,
    width: type === "rectangle" ? 0 : undefined,
    height: type === "rectangle" ? 0 : undefined,
    radiusX: type === "circle" ? 1 : undefined,
    radiusY: type === "circle" ? 1 : undefined,
    fill,
    strokeWidth,
    color,
    borderRadius,
    draggable: false,
    dash: dashPattern ? scaleDashPattern(dashPattern, strokeWidth) : undefined,
    opacity,
  };
};

// Test if a point hits an element. Used by erase tool.
export const hitTestElement = (
  element: MapElement,
  pos: { x: number; y: number }
): boolean => {
  if (element.x !== undefined && element.y !== undefined) {
    // Circle - ellipse equation test
    if (element.type === "circle") {
      const radiusX = element.radiusX || element.radius || 1;
      const radiusY = element.radiusY || element.radius || 1;
      if (radiusX === 0 || radiusY === 0) return false; // Avoid division by zero
      const dx = pos.x - element.x;
      const dy = pos.y - element.y;
      return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
    }

    // Rectangle - bounding box test
    const elWidth = element.width || (element.radiusX ? element.radiusX * 2 : 0);
    const elHeight = element.height || (element.radiusY ? element.radiusY * 2 : 0);

    if (element.type === "text") {
      const halfW = (elWidth * 3) / 2;
      const halfH = elHeight / 2;  // already canvas-space (stored as offsetHeight * 3)
      return (
        pos.x >= element.x - halfW &&
        pos.x <= element.x + halfW &&
        pos.y >= element.y - halfH &&
        pos.y <= element.y + halfH
      );
    }

    return (
      pos.x >= element.x &&
      pos.x <= element.x + elWidth &&
      pos.y >= element.y &&
      pos.y <= element.y + elHeight
    );
  }

  // Lines and arrows - check distance to line segment
  if (element.points && (element.type === "line" || element.type === "arrow")) {
    const points = element.points;
    const threshold = (element.strokeWidth || 5) + 5;

    for (let i = 0; i < points.length - 2; i += 2) {
      const x1 = points[i];
      const y1 = points[i + 1];
      const x2 = points[i + 2];
      const y2 = points[i + 3];

      const A = pos.x - x1;
      const B = pos.y - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;

      let xx: number, yy: number;

      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      const dx = pos.x - xx;
      const dy = pos.y - yy;
      if (Math.sqrt(dx * dx + dy * dy) <= threshold) {
        return true;
      }
    }
  }
  return false;
};
