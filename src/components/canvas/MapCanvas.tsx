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
import { Settings, ArrowDownToLine, FileUp } from "lucide-react";
import SettingsModal from "../base/SettingsModal";
import { useUIStore } from "@/stores/useUIStore";
import useMapImportExport from "@/hooks/useMapImportExport";
import Tooltip from '../ui/Tooltip';

interface MapCanvasProps {
  map: Map;
}

const MapCanvas = ({ map }: MapCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // App State
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
  const isDefense = useAppStore((s) => s.mapSide === "Defense");
  const imageWidth = useAppStore((s) => s.mapImageSize.width);
  const imageHeight = useAppStore((s) => s.mapImageSize.height);

  // Handlers
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawingHandlers();
  const { handleWheel, handleDragStart, handleDragMove, handleDragEnd, isDragging } = useStageInteraction();
  const { handleDragOver, handleDrop } = useHeroDrop();

  // Dialogs
  const showModal = useUIStore((s) => s.openModal);
  const { exportMap, importMap } = useMapImportExport();

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

  const handleImportMap = async () => {
    importMap();
  }

  const handleExportMap = () => {
    exportMap(map.name);
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 relative bg-background"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Top Buttons */}
      <div className="absolute top-2 right-2 z-30 flex flex-col items-center gap-2">
        {/* Settings */}
        <Tooltip
          content={(
            <div>Settings</div>
          )}
          properties={{
            side: "left",
            delay: 200,
          }}
        >
          <button
            className="p-2 bg-fill hover:bg-fill-hover hover:cursor-pointer rounded-md transition-all duration-200 flex items-center gap-3 group"
            onClick={() => showModal({
              content: <SettingsModal/>,
              showBackdrop: true,
              showCloseButton: true,
            })}
          >
            <Settings size={26} className="text-text"/>
          </button>
        </Tooltip>

        {/* Import */}

        <Tooltip
          content={(
            <div>Import from <span className="bg-fill-hover py-0.5 px-2 ml-1 rounded-md text-accent-active">*.map</span></div>
          )}
          properties={{
            side: "left",
            delay: 200,
          }}
        >
          <button
            className="p-2 bg-fill hover:bg-fill-hover hover:cursor-pointer rounded-md transition-all duration-200 flex items-center gap-3 group"
            onClick={handleImportMap}
          >
            <FileUp size={26} className="text-text"/>
          </button>
        </Tooltip>

        {/* Export */}
        <Tooltip
          content={(
            <div>Export to <span className="bg-fill-hover py-0.5 px-2 ml-1 rounded-md text-accent-active">*.map</span></div>
          )}
          properties={{
            side: "left",
            delay: 200,
          }}
        >
          <button
            className="p-2 bg-fill hover:bg-fill-hover hover:cursor-pointer rounded-md transition-all duration-200 flex items-center gap-3 group"
            onClick={handleExportMap}
          >
            <ArrowDownToLine size={26} className="text-text"/>
          </button>
        </Tooltip>
      </div>

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
        <Layer
          rotation={isDefense ? 180 : 0}
          offsetX={isDefense ? imageWidth/2 : 0}
          offsetY={isDefense ? imageHeight/2 : 0}
          x={isDefense ? imageWidth/2 : 0}
          y={isDefense ? imageHeight/2 : 0}
        >
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
