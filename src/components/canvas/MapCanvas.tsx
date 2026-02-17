import { useEffect, useRef, useState, type DragEvent} from "react";
import { Stage, Layer } from "react-konva";
import { type Map } from "@/lib/mapInfo";
import MapImage from "./MapImage";
import { useStageContext } from "@/providers/AppProvider";
import ElementRenderer from "./ElementRenderer";
import type { HeroInfo } from "@/lib/heroInfo";
import type { KonvaEventObject } from "konva/lib/Node";
import SelectionTransformer from "../base/SelectionTransformer";
import TextElement from "./TextElement";

export interface MapElement {
  id: string;
  type: "line" | "arrow" | "rectangle" | "circle" | "text" | "image";
  draggable?: boolean;
  // Lines and Arrows
  points?: number[];
  dash?: number[]; // for dashed lines
  // Positioned Elements
  x?: number;
  y?: number;
  // Shapes
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  // Text
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  isEditing?: boolean;
  // Common Styles
  color?: string;
  fill?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;
  opacity?: number;
  // Image
  src?: string;
  // Arrow Properties
  pointerLength?: number;
  pointerWidth?: number;
}

interface MapCanvasProps {
  map: Map;
}

const MapCanvas = ({ map }: MapCanvasProps) => {
  // Container Reference
  // used when calculating stage dimensions
  const containerRef = useRef<HTMLDivElement>(null);

  const drawStartPos = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] =  useState(false);

  const {
    stageScale,
    setStageScale,
    stagePosition,
    setStagePosition,
    stageDimensions,
    setStageDimensions,
    stageRef,
    elements,
    addElement,
    removeElement,
    updateElement,
    selectedElementId,
    setSelectedElementId,

    // Drawing State
    toolSettings,
    activeTool,
    setActiveTool,
    isDrawing,
    setIsDrawing,

    // History
    startBatch,
    endBatch,
  } = useStageContext();

  // Delete selected element on Delete / Backspace key press
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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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
    updateDimensions(); // Initial call to set dimensions

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [setStageDimensions]);

  // Deselect when a tool becomes active
  useEffect(() => {
    if (activeTool !== "none") {
      setSelectedElementId(null);
    }
  }, [activeTool, setSelectedElementId]);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const scaleStep = 0.05;
    const scaleMin = 0.2;
    const scaleMax = 1;

    let newScale: number;
    if (e.evt.deltaY > 0) {
      newScale = Math.max(scaleMin, oldScale - scaleStep);
    } else {
      newScale = Math.min(scaleMax, oldScale + scaleStep);
    }

    if (newScale === oldScale) return;

    const newPos = {
      x: Math.round(pointer.x - mousePointTo.x * newScale),
      y: Math.round(pointer.y - mousePointTo.y * newScale),
    };

    setStageScale(newScale);
    setStagePosition(newPos);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    try {
      const heroData = e.dataTransfer.getData("application/hero");
      const isAlly = e.dataTransfer.getData("application/isAlly") === "true";
      const hero: HeroInfo = JSON.parse(heroData);

      // Calculate canvas coordinates from drop event
      const stage = stageRef.current;
      if (!stage) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const stageX = stage.x();
      const stageY = stage.y();
      const stageScaleX = stage.scaleX();

      // Convert screen coordinates to canvas coordinates
      const canvasCoords = {
        x: (clientX - stageX) / stageScaleX,
        y: (clientY - stageY) / stageScaleX,
      };

      const styles = getComputedStyle(document.documentElement);
      const backgroundColor = isAlly
        ? styles.getPropertyValue("--color-overwatch-ally")
        : styles.getPropertyValue("--color-overwatch-enemy");

      console.log(
        "Background color for",
        isAlly ? "ally" : "enemy",
        "is",
        backgroundColor
      );

      // Create hero element with calculated coordinates
      const heroElement: MapElement = {
        id: `hero-${hero.id}-${Math.random()}`,
        type: "image",
        x: canvasCoords.x - 40,
        y: canvasCoords.y - 40,
        src: hero.portrait,
        backgroundColor,
        width: 80,
        height: 80,
        draggable: true,
        borderRadius: 8,
      };

      addElement(heroElement);

    } catch (error) {
      console.error("Failed to parse dropped data:", error);
    }
  };

  /* ------------------------------- DRAG EVENTS ------------------------------ */

  const handleDragStart = (e: KonvaEventObject<globalThis.DragEvent>) => {
    // Only handle stage dragging, not element dragging
    if (e.target !== stageRef.current) return;
    if (isDrawing || activeTool !== "none") return;
    setIsDragging(true);
  };

  const handleDragEnd = (e: KonvaEventObject<globalThis.DragEvent>) => {
    // Only handle stage dragging, not element dragging
    if (e.target !== stageRef.current) return;
    if (isDrawing || activeTool !== "none") return;

    const stage = stageRef.current;
    if (!stage) return;
    setStagePosition({
      x: stage.x(),
      y: stage.y(),
    });
    setIsDragging(false);
  };

  const handleDragMove = (e: KonvaEventObject<globalThis.DragEvent>) => {
    // Only handle stage dragging, not element dragging
    if (e.target !== stageRef.current) return;
    if (isDrawing || activeTool !== "none") return;

    const stage = stageRef.current;
    if (!stage) return;
    setStagePosition({
      x: stage.x(),
      y: stage.y(),
    });
  };

  const handleElementDragEnd = (id: string, x: number, y: number) => {
    updateElement(id, { x, y });
  };

  /* ------------------------------ MOUSE EVENTS ------------------------------ */

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {

    const stage = stageRef.current;
    if (!stage) return;

    // Allow stage dragging for only middle click
    if (e.evt.button === 1) {
      stage.draggable(true);
    } else {
      stage.draggable(false);
    }

    // Disable stage dragging for left click if a tool is active
    if (e.evt.button === 0 && activeTool !== "none") {

      // Handle drawing tool
      switch(activeTool) {
        case "pen":
          handleDrawingTool(e);
          break;
        case "line":
          handleLineTool(e);
          break;
        case "rectangle":
          handleShapeTool("rectangle")(e);
          break;
        case "circle":
          handleShapeTool("circle")(e);
          break;
        case "erase":
          handleEraseTool(e);
          break;
        case "text":
          handleTextTool(e);
          break;
        default:
          break;
      }

    } else if (e.evt.button === 0) {
      // Deselect any selected element when clicking on empty space
      if (
        e.target === stageRef.current ||
        e.target.id().includes("map-image")
      ) {
        setSelectedElementId(null);
      } else {
        // Get target element
        const targetElement = e.target;
        if (!targetElement) return;

        setSelectedElementId(targetElement.id());
      }
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const stage = stageRef.current;
    if (!stage) return;

    const pos = getStageCoords();

    const lastElement = elements[elements.length - 1];
    const isAlt = e.evt.altKey;
    const isShift = e.evt.shiftKey;

    switch(activeTool) {
      case "pen": {
        if (!lastElement || lastElement.type !== "line" && lastElement.type !== "arrow") return;

        // Only add point if moved a significant distance
        const points = lastElement.points || [];
        if (points.length >= 2) {
          const lastX = points[points.length - 2];
          const lastY = points[points.length - 1];
          const distance = Math.sqrt(Math.pow(pos.x - lastX, 2) + Math.pow(pos.y - lastY, 2));

          const minDistance = 5;
          if (distance < minDistance) return;
        }
        const newPoints = lastElement.points ? [...lastElement.points, pos.x, pos.y] : [pos.x, pos.y];

        // Update the last element's points
        updateElement(lastElement.id, { points: newPoints });
        break;
      }
      case "line": {
        if (!lastElement || (lastElement.type !== "line" && lastElement.type !== "arrow")) return;

        const newPoints = lastElement.points
          ? [lastElement.points[0], lastElement.points[1], pos.x, pos.y]
          : [pos.x, pos.y, pos.x, pos.y];

        updateElement(lastElement.id, { points: newPoints });
        break;
      }
      case "rectangle": {
        if (!lastElement || lastElement.type !== "rectangle") return;
        if (!drawStartPos.current) return;

        const startX = drawStartPos.current.x;
        const startY = drawStartPos.current.y;

        let width = pos.x - startX;
        let height = pos.y - startY;

        // Shift = constrain to square
        if (isShift) {
          const size = Math.max(Math.abs(width), Math.abs(height));
          width = size * Math.sign(width || 1);
          height = size * Math.sign(height || 1);
        }

        if (isAlt) {
          // Center mode: expand from point
          const x = startX - Math.abs(width) / 2;
          const y = startY - Math.abs(height) / 2;

          updateElement(lastElement.id, { x, y, width, height });
        } else {
          // Normal mode: expand from corner
          updateElement(lastElement.id, { width, height });
        }
        break;
      }
      case "circle": {
        if (!lastElement || lastElement.type !== "circle") return;
        if (!drawStartPos.current) return;

        const startX = drawStartPos.current.x;
        const startY = drawStartPos.current.y;

        let radiusX: number;
        let radiusY: number;
        let centerX: number;
        let centerY: number;

        if (isAlt) {
          // Center mode
          radiusX = Math.abs(pos.x - startX);
          radiusY = Math.abs(pos.y - startY);
          centerX = startX;
          centerY = startY;
        } else {
          // Corner mode
          const width = pos.x - startX;
          const height = pos.y - startY;
          centerX = startX + width / 2;
          centerY = startY + height / 2;
          radiusX = Math.abs(width / 2);
          radiusY = Math.abs(height / 2);
        }

        // Shift = constrain to circle
        if (isShift) {
          const radius = Math.max(radiusX, radiusY);
          radiusX = radius;
          radiusY = radius;
        }

        updateElement(lastElement.id, { x: centerX, y: centerY, radiusX, radiusY });
        break;
      }
      case "erase": {
        handleEraseTool(e);
        break;
      }
      default:
        break;
    }
  }

  const handleMouseUp = () => {
    if (isDrawing) {
      const lastElement = elements[elements.length - 1];
      if (lastElement) {
        updateElement(lastElement.id, { draggable: true });
      }
      setIsDrawing(false);
      endBatch();
      drawStartPos.current = null;
      setActiveTool("none");
      setSelectedElementId(null); // Deselect after drawing
    }

    // Re-enable dragging after mouse up
    const stage = stageRef.current;
    if (!stage) return;
    stage.draggable(false);
  }

  /* ---------------------------- DRAWING HANDLERS ---------------------------- */

  const handleDrawingTool = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return; // Only respond to left click

    startBatch();

    const stage = stageRef.current;
    if (!stage) return;

    const pos = getStageCoords();

    setIsDrawing(true);

    const brushType = toolSettings.pen.brushType;
    const isArrow = brushType === "arrow" || brushType === "dashedArrow";
    const isDashed = brushType === "dashedLine" || brushType === "dashedArrow";

    // Scale dash pattern based on brush size (16 is the base size)
    const scaleFactor = toolSettings.pen.brushSize / 16;
    const scaledDash = isDashed
      ? toolSettings.pen.dashPattern.map((value) => value * scaleFactor)
      : undefined;

    // Scale pointer size based on brush size
    const scaledFactor = toolSettings.pen.brushSize / 16;
    const pointerLength = isArrow
      ? Math.max(5, toolSettings.pen.pointer.length * scaledFactor)
      : undefined;
    const pointerWidth = isArrow
      ? Math.max(5, toolSettings.pen.pointer.width * scaledFactor)
      : undefined;

    const newLine: MapElement = {
      id: `${isArrow ? "arrow" : "line"}-${Date.now()}`,
      type: isArrow ? "arrow" : "line",
      points: [pos.x, pos.y],
      color: toolSettings.pen.color,
      strokeWidth: toolSettings.pen.brushSize,
      dash: scaledDash,
      pointerLength: pointerLength,
      pointerWidth: pointerWidth,
      opacity: toolSettings.pen.opacity
    }

    addElement(newLine);
  };

  const handleLineTool = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return; // Only respond to left click

    startBatch();

    const stage = stageRef.current;
    if (!stage) return;

    const pos = getStageCoords();

    setIsDrawing(true);

    const brushType = toolSettings.pen.brushType;
    const isArrow = brushType === "arrow" || brushType === "dashedArrow";
    const isDashed = brushType === "dashedLine" || brushType === "dashedArrow";

    // Scale dash pattern based on brush size (16 is the base size)
    const scaleFactor = toolSettings.pen.brushSize / 16;
    const scaledDash = isDashed
      ? toolSettings.pen.dashPattern.map((value) => value * scaleFactor)
      : undefined;

    // Scale pointer size based on brush size
    const scaledFactor = toolSettings.pen.brushSize / 16;
    const pointerLength = isArrow
      ? Math.max(5, toolSettings.pen.pointer.length * scaledFactor)
      : undefined;
    const pointerWidth = isArrow
      ? Math.max(5, toolSettings.pen.pointer.width * scaledFactor)
      : undefined;

    const newLine: MapElement = {
      id: `${isArrow ? "arrow" : "line"}-${Date.now()}`,
      type: isArrow ? "arrow" : "line",
      points: [pos.x, pos.y, pos.x, pos.y],
      color: toolSettings.pen.color,
      strokeWidth: toolSettings.pen.brushSize,
      dash: scaledDash,
      pointerLength: pointerLength,
      pointerWidth: pointerWidth,
      opacity: toolSettings.pen.opacity
    };

    addElement(newLine);
  }

  const handleShapeTool = (type: "rectangle" | "circle") => (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return; // Only respond to left click

    startBatch();

    const stage = stageRef.current;
    if (!stage) return;

    const pos = getStageCoords();

    drawStartPos.current = { x: pos.x, y: pos.y };

    setIsDrawing(true);

    // Scale dash pattern based on brush size (16 is the base size)
    const scaleFactor = toolSettings.shape.strokeWidth / 16;
    const scaledDash = toolSettings.shape.dashPattern
      ? toolSettings.shape.dashPattern.map((value) => value * scaleFactor)
      : undefined;

    const newShape: MapElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: pos.x,
      y: pos.y,
      width: type === "rectangle" ? 0 : undefined,
      height: type === "rectangle" ? 0 : undefined,
      radiusX: type === "circle" ? 1 : undefined,
      radiusY: type === "circle" ? 1 : undefined,
      fill: toolSettings.shape.fill,
      strokeWidth: toolSettings.shape.strokeWidth,
      color: toolSettings.shape.color,
      borderRadius: toolSettings.shape.borderRadius,
      draggable: false,
      dash: scaledDash,
      opacity: toolSettings.shape.opacity
    };

    addElement(newShape);
  }

  const handleEraseTool = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return; // Only respond to left click

    startBatch();

    const stage = stageRef.current;
    if (!stage) return;

    const pos = getStageCoords();

    setIsDrawing(true);

    // Find element at position
    const clickedElement = elements.find((element) => {
      // Check positioned elements (images, rectangles, text)
      if (element.x !== undefined && element.y !== undefined) {
        const elX = element.x;
        const elY = element.y;
        const elWidth = element.width || (element.radiusX ? element.radiusX * 2 : 0);
        const elHeight = element.height || (element.radiusY ? element.radiusY * 2 : 0);

        // For circles check radius
        if (element.type === "circle") {
          const radiusX = element.radiusX || element.radius || 0;
          const radiusY = element.radiusY || element.radius || 0;
          const dx = pos.x - elX;
          const dy = pos.y - elY;
          return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
        }

        return (pos.x >= elX &&
          pos.x <= elX + elWidth &&
          pos.y >= elY &&
          pos.y <= elY + elHeight);
      }

      // Check for lines and arrows
      if (element.points && (element.type === "line" || element.type === "arrow")) {
        const points = element.points;
        const threshold = (element.strokeWidth || 5) + 5; // Add some padding

        // Check each segment of the line
        for (let i = 0; i < points.length - 2; i += 2) {
          const x1 = points[i];
          const y1 = points[i + 1];
          const x2 = points[i + 2];
          const y2 = points[i + 3];

          // Calculate distance from point to line segment
          const A = pos.x - x1;
          const B = pos.y - y1;
          const C = x2 - x1;
          const D = y2 - y1;

          const dot = A * C + B * D;
          const len_sq = C * C + D * D;
          let param = -1;

          if (len_sq !== 0) { // in case of 0 length line
            param = dot / len_sq;
          }

          let xx, yy;

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
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= threshold) {
            return true;
          }
        }
      }

      return false;
    });

    if (clickedElement) {
      // Remove element
      removeElement(clickedElement.id);
    }
  }

  const handleTextTool = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return; // Only respond to left click

    console.log("Text tool clicked");

    const stage = stageRef.current;
    if (!stage) return;

    const pos = getStageCoords();

    // TODO: Implement text
    const newText: MapElement = {
      id: `text-${Date.now()}`,
      type: "text",
      x: pos.x,
      y: pos.y,
      text: "",
      width: 200,
      fontSize: 18,
      fontFamily: "Arial",
      color: "#FFFFFF",
      draggable: true,
      isEditing: true
    }

    addElement(newText);
    setActiveTool("none");
  }

  const getStageCoords = () => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };

    const pos = stage.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };

    return {
      x: (pos.x - stage.x()) / stage.scaleX(),
      y: (pos.y - stage.y()) / stage.scaleY(),
    };
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 relative bg-background"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="absolute top-4 left-4 px-4 py-2 z-10 rounded-md bg-fill-dark">
        <p>Stage Position: {`(${stagePosition.x}, ${stagePosition.y})`}</p>
        <p>Stage Scale: {stageScale.toFixed(2)}</p>
        <p>Selected Element ID: {selectedElementId || "None"}</p>
        <p>Is Drawing: {isDrawing ? "Yes" : "No"}</p>
        <p>Active Tool: {activeTool || "None"}</p>
        { activeTool === "pen" && (
          <p>Brush: {toolSettings.pen.brushType}</p>
        )}
      </div>

      {/* Text Elements - rendered outside canvas */}
      {elements.filter(el => el.type === "text").map((element) => {
        return (<TextElement
          key={element.id}
          element={element}
          onUpdate={updateElement}
          stageScale={stageScale}
          stagePosition={stagePosition}
        />)
      })}

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
        {/* Map Layer */}
        <Layer>
          <MapImage src={map.mapImage} />
        </Layer>
        {/* Elements Layer */}
        <Layer>
          {elements.filter(el => el.type !== "text").map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              onDragEnd={handleElementDragEnd}
            />
          ))}
          {/* Selection UI - Renders on Top */}
          {!isDrawing && !isDragging && (<SelectionTransformer
            selectedElement={elements.find(e => e.id === selectedElementId) ?? null}
            stageRef={stageRef}
            onTransformEnd={updateElement}
            stageScale={stageScale}
          />)}
        </Layer>
      </Stage>
    </div>
  );
};

export default MapCanvas;
