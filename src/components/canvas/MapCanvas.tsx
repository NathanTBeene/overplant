import { useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { type Map } from "@/lib/mapInfo";
import MapImage from "./MapImage";
import { useStageContext } from "@/providers/AppProvider";
import ElementRenderer from "./ElementRenderer";
import type { HeroInfo } from "@/lib/heroInfo";

export interface MapElement {
  id: string;
  type: "line" | "arrow" | "rectangle" | "circle" | "text" | "image";
  draggable?: boolean;
  // Lines and Arrows
  points?: number[];
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
  // Common Styles
  color?: string;
  fill?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;
  // Image
  src?: string;
}

interface MapCanvasProps {
  map: Map;
}

const MapCanvas = ({ map }: MapCanvasProps) => {
  // Container Reference
  // used when calculating stage dimensions
  const containerRef = useRef<HTMLDivElement>(null);

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
    setSelectedElementId,
  } = useStageContext();

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
  }, []);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
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

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: any) => {
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

  const handleMouseDown = (e: any) => {
    // Deselect any selected element when clicking on empty space
    if (e.target === e.target.getStage()) {
      setSelectedElementId(null);
    }

    // Dont do anything on middle/right click
    if (e.evt.button !== 0) {
      e.evt.preventDefault();
      return;
    }
  };

  const handleDragEnd = (e: any) => {
    const stage = e.target.getStage();
    setStagePosition({
      x: stage.x(),
      y: stage.y(),
    });
  };

  const handleDragMove = (e: any) => {
    const stage = e.target.getStage();
    setStagePosition({
      x: stage.x(),
      y: stage.y(),
    });
  };

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
      </div>
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
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
      >
        {/* Map Layer */}
        <Layer>
          <MapImage src={map.mapImage} />
        </Layer>
        {/* Elements Layer */}
        <Layer>
          {elements.map((element) => (
            <ElementRenderer key={element.id} element={element} />
          ))}
        </Layer>
        {/* Drawing Layer */}
        <Layer></Layer>
      </Stage>
    </div>
  );
};

export default MapCanvas;
