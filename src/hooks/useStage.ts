import { type MapElement } from "@/components/canvas/MapCanvas";
import type { HeroInfo } from "@/lib/heroInfo";
import type Konva from "konva";
import { useRef, useState } from "react";
import { type Map, getInitialMapSettings } from "@/lib/mapInfo";

// Hook to handle stage related logic and settings
export const useStage = () => {
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [stageDimensions, setStageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const stageRef = useRef<Konva.Stage | null>(null);

  const [elements, setElements] = useState<MapElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

    setElements((prevElements) =>
      prevElements.map((el) => {
        const newX = imageWidth - (el.x! + (el.width || 0));
        const newY = imageHeight - (el.y! + (el.height || 0));
        return {
          ...el,
          x: newX,
          y: newY,
        };
      })
    );
  };

  const setInitialStageSettings = (map: Map) => {
    const settings = getInitialMapSettings(map.id, mapSide);

    if (settings) {
      setStageScale(settings.scale);
      setStagePosition(settings.position);
    }
  };

  const getCanvasCoordinates = (stage: Konva.Stage) => {
    const point = stage.getPointerPosition();
    if (!point) return { x: 0, y: 0 };

    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();

    return transform.point(point);
  };

  const addElement = (element: MapElement, startDragging: boolean = false) => {
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

  const removeElement = (id: string) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  };

  const clearElements = () => {
    setElements([]);
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
    isDrawing,
    setIsDrawing,
    addHero,
    selectedElementId,
    setSelectedElementId,
    setInitialStageSettings,
    mapSide,
    toggleMapSide,
    clearElements,
  };
}
