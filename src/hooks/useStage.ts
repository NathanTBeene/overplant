import { type MapElement } from "@/components/canvas/MapCanvas";
import type { HeroInfo } from "@/lib/heroInfo";
import type Konva from "konva";
import { useRef, useState } from "react";
import { type Map, getInitialMapSettings } from "@/lib/mapInfo";
import type { ToolType } from "@/components/sidebar/components/ToolsBar";
import type { BrushType } from "@/components/sidebar/components/ToolsBar/BrushTypeSelector";

// Hook to handle stage related logic and settings
export const useStage = () => {
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [stageDimensions, setStageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const stageRef = useRef<Konva.Stage | null>(null);
  const [toolSettings, setToolSettings] = useState(makeToolSettings());
  const [activeTool, setActiveTool] = useState<ToolType>("none");

  const [elements, setElements] = useState<MapElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  /* --------------------------- HISTORY MANAGEMENT --------------------------- */

  const MAX_HISTORY_SIZE = 50;
  const historyRef = useRef<{past: MapElement[][], future: MapElement[][]}>({ past: [], future: [] });
  const batchStartSnapshot = useRef<MapElement[] | null>(null);
  const [,forceHistoryUpdate] = useState(0); // State to force re-render for history updates

  const pushToHistory = (snapshot: MapElement[]) => {
    const { past } = historyRef.current;

    // If the last snapshot is identical to the current, do not push
    if (past.length > 0) {
      const lastSnapshot = past[past.length - 1];
      if (JSON.stringify(lastSnapshot) === JSON.stringify(snapshot)) {
        return;
      }
    }

    // Push current elements to history.
    // Respect max history size.
    if (past.length >= MAX_HISTORY_SIZE) {
      past.shift();
    }

    past.push(snapshot);
    forceHistoryUpdate((n) => n + 1);
  }

  const startBatch = () => {
    batchStartSnapshot.current = [...elements]; // Store current elements as batch start snapshot
  }

  const endBatch = () => {
    if (batchStartSnapshot.current) {
      pushToHistory(batchStartSnapshot.current);
      batchStartSnapshot.current = null;
      // Clear future on new action
      historyRef.current.future = [];
      forceHistoryUpdate((n) => n + 1);
    }
  }

  const undo = () => {
    const { past, future } = historyRef.current;
    if (past.length === 0) return;
    const previous = past.pop()!;
    future.push(elements);
    setElements(previous);
    forceHistoryUpdate((n) => n + 1);
    setSelectedElementId(null);
  }

  const redo = () => {
    const { past, future } = historyRef.current;
    if (future.length === 0) return;
    const next = future.pop()!;
    past.push(elements);
    setElements(next);
    forceHistoryUpdate((n) => n + 1);
    setSelectedElementId(null);
  }

  const clearHistory = () => {
    historyRef.current = { past: [], future: [] };
    forceHistoryUpdate((n) => n + 1);
  }

  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;

  /* --------------------------- MAP SIDE HANDLING --------------------------- */

  const [mapSide, setMapSide] = useState<"Attack" | "Defense">("Attack");

  const toggleMapSide = () => {
    setMapSide((prev) => (prev === "Attack" ? "Defense" : "Attack"));

    // Reverse elements positions
    const stage = stageRef.current;
    if (!stage) return;

    const mapImage = stage.findOne("Image");;
    if (!mapImage) return;
    const imageWidth = mapImage.width() || 0;
    const imageHeight = mapImage.height() || 0;

    setElements((prevElements) => {
      pushToHistory(prevElements);
      return prevElements.map((el) => {
        const newX = imageWidth - (el.x! + (el.width || 0));
        const newY = imageHeight - (el.y! + (el.height || 0));
        return {
          ...el,
          x: newX,
          y: newY,
        };
      })
    });
  };

  const setInitialStageSettings = (map: Map) => {
    const settings = getInitialMapSettings(map.id, mapSide);

    if (settings) {
      setStageScale(settings.scale);
      setStagePosition(settings.position);
    }
  };

  /* --------------------------- ELEMENT MANAGEMENT --------------------------- */

  const addElement = (element: MapElement, startDragging: boolean = false) => {
    if (batchStartSnapshot.current === null)
      pushToHistory(elements);

    setElements((prevElements) => [...prevElements, element]);
    if (startDragging) {
      setTimeout(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const node = stage.findOne(`#${element.id}`);
        if (node) {
          node.startDrag();
        }
      });
    }
  }

  const updateElement = (id: string, updates: Partial<MapElement>) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      )
    );
  }

  const removeElement = (id: string) => {
    if (batchStartSnapshot.current === null)
      pushToHistory(elements);
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  };

  const clearElements = () => {
    if (batchStartSnapshot.current === null)
      pushToHistory(elements);
    setElements([]);
  };

  const addHero = (info: HeroInfo) => {
    const stage = stageRef.current;
      if (!stage) return;

      const canvasCoords = getCanvasCoordinates(stage);
      if (!canvasCoords) return;

      const heroElement: MapElement = {
        id: `hero-${info.id}-${Math.random()}`,
        type: "image",
        x: canvasCoords.x - 40,
        y: canvasCoords.y - 40,
        src: info.portrait,
        backgroundColor: "#45556c",
        width: 80,
        height: 80,
        draggable: true,
        borderRadius: 8,
      };

      addElement(heroElement);
  };

  /* --------------------------------- UTILITY -------------------------------- */

  const getCanvasCoordinates = (stage: Konva.Stage) => {
    const point = stage.getPointerPosition();
    if (!point) return { x: 0, y: 0 };

    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();

    return transform.point(point);
  };

  return {
    stageScale,
    setStageScale,
    stagePosition,
    setStagePosition,
    stageDimensions,
    setStageDimensions,
    stageRef,
    elements,
    setElements,
    getCanvasCoordinates,
    addElement,
    removeElement,
    addHero,
    selectedElementId,
    setSelectedElementId,
    setInitialStageSettings,
    mapSide,
    toggleMapSide,
    clearElements,
    updateElement,

    // Drawing
    isDrawing,
    setIsDrawing,
    toolSettings,
    setToolSettings,
    activeTool,
    setActiveTool,

    // History State
    undo,
    redo,
    canUndo,
    canRedo,
    startBatch,
    endBatch,
    clearHistory,
  };
}


const makeToolSettings = () => {
  const settings = {
    pen: {
      brushType: "line" as BrushType,
      color: "#000000",
      opacity: 100,
      brushSize: 16,
      dashPattern: [50, 15],
      pointer: {
        length: 20,
        width: 40
      },
      maxAnchors: 10,
      minAnchorStep: 10,
    },
    shape: {
      brushType: "line" as BrushType,
      color: "#000000",
      fill: "#00000000",
      strokeWidth: 16,
      borderRadius: 4,
      opacity: 100,
      dashPattern: [50, 15],
    },
    text: {
      color: "#eeeeee",
      fontSize: 24,
      fontFamily: "Arial",
      opacity: 100,
    }
  };

  return settings;
}
