import { useStageContext } from "@/providers/AppProvider";
import type { KonvaEventObject } from "konva/lib/Node";
import { Circle, Group } from "react-konva";
import type { MapElement } from "../canvas/MapCanvas";

interface LineAnchorsProps {
  element: MapElement;
  onPointMove(index: number, x: number, y: number): void;
  stageScale?: number;
}

const LineAnchors = ({ element, onPointMove, stageScale = 1 }: LineAnchorsProps) => {
  const { toolSettings } = useStageContext();


  if (!element.points || element.points.length === 0) return null;

  // Freehand lines may have many points; limit anchors to every Nth point for performance
  const maxAnchors = toolSettings.pen.maxAnchors;
  const minStep = toolSettings.pen.minAnchorStep;
  const pointCount = element.points.length / 2;

  const getAnchorPointIndices = () => {
    // Bug fix 2: For very small lines, don't show excessive anchors
    // Apply minStep even for small point counts
    if (pointCount <= 2) {
      return Array.from({ length: pointCount }, (_, i) => i);
    }

    const step = Math.max(minStep, Math.ceil(pointCount / maxAnchors));

    // If step is 1, just return all points (but respect maxAnchors)
    if (step === 1 && pointCount <= maxAnchors) {
      return Array.from({ length: pointCount }, (_, i) => i);
    }

    const indices: number[] = [];
    for (let i = 0; i < pointCount - 1; i += step) {
      indices.push(i);
    }

    // Bug fix 1: Check if last point is too close to previous anchor
    const lastIndex = pointCount - 1;
    const lastAddedIndex = indices[indices.length - 1];
    const distanceToEnd = lastIndex - lastAddedIndex;

    if (distanceToEnd > 0) {
      // If the gap to the end is less than half a step, replace last anchor with end
      if (distanceToEnd < step / 2) {
        indices[indices.length - 1] = lastIndex;
      } else {
        // Otherwise add the end point
        indices.push(lastIndex);
      }
    }

    return indices;
  };

  const anchorPointIndices = getAnchorPointIndices();
  const anchorRadius = 6 / stageScale;

  return (
    <Group>
      {anchorPointIndices.map((pointIndex, anchorIndex) => {
        const x = element.points![pointIndex * 2];
        const y = element.points![pointIndex * 2 + 1];

        return (
          <Circle
            key={anchorIndex}
            x={x}
            y={y}
            radius={anchorRadius}
            fill="#ffffff"
            stroke="#0096ff"
            strokeWidth={2 / stageScale}
            draggable
            onDragMove={(e: KonvaEventObject<DragEvent>) => {
              // Pass the actual point index, not the anchor index
              onPointMove(pointIndex, e.target.x(), e.target.y());
            }}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "grab";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true // Prevent stage dragging when interacting with anchors
            }}
          />
        );
      })}
    </Group>
  );
}

export default LineAnchors
