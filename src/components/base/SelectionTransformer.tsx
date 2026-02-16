import type Konva from "konva";
import type { MapElement } from "../canvas/MapCanvas";
import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import LineAnchors from "./LineAnchors";
import { useStageContext } from "@/providers/AppProvider";

interface SelectionTransformerProps {
  selectedElement: MapElement | null;
  stageRef: React.RefObject<Konva.Stage | null>;
  onTransformEnd: (id: string, updates: Partial<MapElement>) => void;
  stageScale?: number;
}

const SelectionTransformer = ({
  selectedElement,
  stageRef,
  onTransformEnd,
  stageScale = 1,
}: SelectionTransformerProps) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const {toolSettings}  = useStageContext();

  useEffect(() => {
    if (!transformerRef.current || !stageRef?.current) return;

    if (!selectedElement) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }

    const isHero = selectedElement.id.startsWith("hero-");
    const isShape = ["rectangle", "circle", "image", "text"].includes(selectedElement.type);

    if (isShape && !isHero) {
      // Find the node by ID using Konva's findOne
      const node = stageRef.current.findOne(`#${selectedElement.id}`);
      if (node) {
        transformerRef.current.nodes([node]);
      } else {
        transformerRef.current.nodes([]);
      }
    } else {
      transformerRef.current.nodes([]);
    }

    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedElement, stageRef]);

  if (!selectedElement) return null;

  const isLine = selectedElement.type === "line" || selectedElement.type === "arrow";

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    if (selectedElement.type === "rectangle" || selectedElement.type === "image") {
      onTransformEnd(selectedElement.id, {
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      });
    } else if (selectedElement.type === "circle") {
      const ellipse = node as Konva.Ellipse;
      onTransformEnd(selectedElement.id, {
        x: node.x(),
        y: node.y(),
        radiusX: Math.max(5, ellipse.radiusX() * scaleX),
        radiusY: Math.max(5, ellipse.radiusY() * scaleY),
      });
    }
  };

  const handlePointMove =(index: number, x: number, y: number) => {
    if (!selectedElement.points) return;

    const points = [...selectedElement.points];
    const pointCount = points.length / 2;

    // Get Anchor indices
    const maxAnchors = toolSettings.pen.maxAnchors;
    const minStep = toolSettings.pen.minAnchorStep;
    let anchorIndices: number[] = [];
    if (pointCount <= maxAnchors) {
      anchorIndices = Array.from({ length: pointCount }, (_, i) => i);
    } else {
      anchorIndices = [0];
      const step = Math.max(minStep, Math.ceil(pointCount / maxAnchors));
      for (let i = step; i < pointCount; i += step) {
        anchorIndices.push(i);
      }
      if (anchorIndices[anchorIndices.length - 1] !== pointCount - 1)
        anchorIndices.push(pointCount - 1);
    }

    // Find this anchor's position in the array
    const anchorPos = anchorIndices.indexOf(index);
    if (anchorPos === -1) return;

    // Get previous and next anchor indices
    const prevAnchorIndex = anchorPos > 0 ? anchorIndices[anchorPos - 1] : null;
    const nextAnchorIndex = anchorPos < anchorIndices.length - 1 ? anchorIndices[anchorPos + 1] : null;

    // Calculate delta
    const dx = x - points[index * 2];
    const dy = y - points[index * 2 + 1];

    // Move anchor point itself
    points[index * 2] = x;
    points[index * 2 + 1] = y;

    // Smooth Interpolation
    const easeT = (t: number) => t * t * (3 - 2 * t); // Smoothstep

    // Move points between previous anchor and this one (Linear Interpolation)
    if (prevAnchorIndex !== null) {
      for (let i = prevAnchorIndex + 1; i < index; i++) {
        const t = easeT((i - prevAnchorIndex) / (index - prevAnchorIndex));
        points[i * 2] += dx * t;
        points[i * 2 + 1] += dy * t;
      }
    }

    // Move points between this anchor and the next anchor (Linear Interpolation)
    if (nextAnchorIndex !== null) {
      for (let i = index + 1; i < nextAnchorIndex; i++) {
        const rawT = (i - index) / (nextAnchorIndex - index); // 0 near current, 1 near next
        const t = easeT(1 - rawT); // Invert: 1 near current anchor, 0 near next anchor
        points[i * 2] += dx * t;
        points[i * 2 + 1] += dy * t;
      }
    }

    onTransformEnd(selectedElement.id, { points });
  }

  return (
    <>
      <Transformer
        ref={transformerRef}
        rotateEnabled={false}
        keepRatio={false}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 5 || newBox.height < 5) return oldBox;
          return newBox;
        }}
        onTransformEnd={handleTransformEnd}
        onMouseDown={(e) => {
          e.cancelBubble = true; // Prevent stage dragging when interacting with transformer
        }}
      />

      {isLine && (
        <LineAnchors
          element={selectedElement}
          stageScale={stageScale}
          onPointMove={handlePointMove}
        />
      )}
    </>
  );
};

export default SelectionTransformer;
