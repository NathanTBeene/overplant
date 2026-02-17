import { useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import type { Map } from "@/lib/mapInfo";
import MapImage from "./MapImage";
import ElementRenderer from "./ElementRenderer";
import SelectionTransformer from "../base/SelectionTransformer";
import TextElement from "./TextElement";
import DebugOverlay from "./DebugOverlay";
import { useAppStore } from "@/stores/useAppStore";
import { stageRef } from "@/stores/stageRef";
import { useDrawingHandlers } from "@/hooks/useDrawingHandlers";
import { useStageInteraction } from "@/hooks/useStageInteraction";
import { useHeroDrop } from "@/hooks/useHeroDrop";

interface MapCanvasProps {
  map: Map;
}

const MapCanvas = ({ map }: MapCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const stageScale = useAppStore((s) => s.stageScale);
  const stagePosition = useAppStore((s) => s.stagePosition);
  const stageDimensions = useAppStore((s) => s.stageDimensions);
  const setStageDimensions = useAppStore((s) => s.setStageDimensions);
  const elements = useAppStore((s) => s.elements);
  const selectedElementId = useAppStore((s) => s.selectedElementId);
  const setSelectedElementId = useAppStore((s) => s.setSelectedElementId);
  const removeElement = useAppStore((s) => s.removeElement);
  const updateElement = useAppStore((s) => s.updateElement);
  const isDrawing = useAppStore((s) => s.isDrawing);
  const activeTool = useAppStore((s) => s.activeTool);

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawingHandlers();
  const { handleWheel, handleDragStart, handleDragMove, handleDragEnd, isDragging } = useStageInteraction();
  const { handleDragOver, handleDrop } = useHeroDrop();

  // Delete selected element on Delete / Backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          removeElement(selectedElementId);
          setSelectedElementId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, removeElement, setSelectedElementId]);

  // Handle stage resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setStageDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, [setStageDimensions]);

  // Deselect when a tool becomes active
  useEffect(() => {
    if (activeTool !== "none") setSelectedElementId(null);
  }, [activeTool, setSelectedElementId]);

  const handleElementDragEnd = (id: string, x: number, y: number) => {
    updateElement(id, { x, y });
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 relative bg-background"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <DebugOverlay />

      {elements.filter((el) => el.type === "text").map((element) => (
        <TextElement
          key={element.id}
          element={element}
          onUpdate={updateElement}
          stageScale={stageScale}
          stagePosition={stagePosition}
        />
      ))}

      <Stage
        width={stageDimensions.width}
        height={stageDimensions.height}
        x={stagePosition.x}
        y={stagePosition.y}
        scaleX={stageScale}
        scaleY={stageScale}
        draggable
        onWheel={handleWheel}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
      >
        <Layer>
          <MapImage src={map.mapImage} />
        </Layer>
        <Layer>
          {elements.filter((el) => el.type !== "text").map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              onDragEnd={handleElementDragEnd}
            />
          ))}
          {!isDrawing && !isDragging && (
            <SelectionTransformer
              selectedElement={elements.find((e) => e.id === selectedElementId) ?? null}
              stageRef={stageRef}
              onTransformEnd={updateElement}
              stageScale={stageScale}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default MapCanvas;
