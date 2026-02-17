import { stageRef } from "@/stores/stageRef";
import { useAppStore } from "@/stores/useAppStore";
import type { MapElement } from "@/types/MapElement";
import { createLineElement, createShapeElement, getStageCoords, hitTestElement } from "@/utils/canvas";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";

export const useDrawingHandlers = () => {
  const drawStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const {
      activeTool,
      toolSettings,
      setIsDrawing,
      addElement,
      startBatch,
      elements,
      removeElement,
      setActiveTool,
      setSelectedElementId,
    } = useAppStore.getState();

    // Middle Click - stage drag
    if (e.evt.button === 1) {
      stage.draggable(true);
      return;
    } else {
      stage.draggable(false);
    }

    // Left Click with active tool = draw
    if (e.evt.button === 0 && activeTool !== "none") {
      const { mapSide, mapImageSize } = useAppStore.getState();
      const pos = getStageCoords(mapSide, mapImageSize);

      switch (activeTool) {
        case "pen":
          startBatch();
          setIsDrawing(true);
          addElement(createLineElement(toolSettings.pen, pos, false));
          break;
        case "line":
          startBatch();
          setIsDrawing(true);
          addElement(createLineElement(toolSettings.pen, pos, false));
          break;
        case "rectangle":
          startBatch();
          setIsDrawing(true);
          drawStartPos.current = { x: pos.x, y: pos.y};
          addElement(createShapeElement(toolSettings.shape, pos, "rectangle"));
          break;
        case "circle":
          startBatch();
          setIsDrawing(true);
          drawStartPos.current = { x: pos.x, y: pos.y};
          addElement(createShapeElement(toolSettings.shape, pos, "circle"));
          break;
        case "erase": {
          startBatch();
          setIsDrawing(true);
          const clicked = elements.find((el) => hitTestElement(el, pos));
          if (clicked) {
            removeElement(clicked.id);
          }
          break;
        }
        case "text": {
          const newText: MapElement = {
            id: `text-${Date.now()}`,
            type: "text",
            x: pos.x,
            y: pos.y,
            text: "",
            width: 200,
            fontSize: 18,
            fontFamily: "Arial",
            color: "#000000",
            draggable: true,
            isEditing: true,
          };
          addElement(newText);
          setActiveTool("none");
          break;
        }
      }
    } else if (e.evt.button === 0) {
      // No tool active - handle selection
      if (e.target === stageRef.current || e.target.id().includes("map-image")) {
        setSelectedElementId(null);
      } else {
        setSelectedElementId(e.target.id());
      }
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const { isDrawing, activeTool, elements, updateElement } =
      useAppStore.getState();

    if (!isDrawing) return;
    if (!stageRef.current) return;

    const { mapSide, mapImageSize } = useAppStore.getState();
    const pos = getStageCoords(mapSide, mapImageSize);
    const lastElement = elements[elements.length - 1];
    if (!lastElement) return;

    const isAlt = e.evt.altKey;
    const isShift = e.evt.shiftKey;

    switch (activeTool) {
      case "pen": {
        if (lastElement.type !== "line" && lastElement.type !== "arrow") return;
        const points = lastElement.points || [];
        if (points.length >= 2) {
          const lastX = points[points.length - 2];
          const lastY = points[points.length - 1];
          const dist = Math.sqrt((pos.x - lastX) ** 2 + (pos.y - lastY) ** 2);
          if (dist < 5) return;
        }
        updateElement(lastElement.id, {
          points: [...(lastElement.points || []), pos.x, pos.y],
        });
        break;
      }
      case "line": {
        if (lastElement.type !== "line" && lastElement.type !== "arrow") return;
        const pts = lastElement.points;
        updateElement(lastElement.id, {
          points: pts
            ? [pts[0], pts[1], pos.x, pos.y]
            : [pos.x, pos.y, pos.x, pos.y],
        });
        break;
      }
      case "rectangle": {
        if (lastElement.type !== "rectangle" || !drawStartPos.current) return;
        const { x: startX, y: startY } = drawStartPos.current;

        let width = pos.x - startX;
        let height = pos.y - startY;

        if (isShift) {
          const size = Math.max(Math.abs(width), Math.abs(height));
          width = size * Math.sign(width || 1);
          height = size * Math.sign(height || 1);
        }

        if (isAlt) {
          updateElement(lastElement.id, {
            x: startX - Math.abs(width) / 2,
            y: startY - Math.abs(height) / 2,
            width,
            height,
          });
        } else {
          updateElement(lastElement.id, { width, height });
        }
        break;
      }
      case "circle": {
        if (lastElement.type !== "circle" || !drawStartPos.current) return;
        const { x: startX, y: startY } = drawStartPos.current;

        let radiusX: number, radiusY: number, centerX: number, centerY: number;

        if (isAlt) {
          radiusX = Math.abs(pos.x - startX);
          radiusY = Math.abs(pos.y - startY);
          centerX = startX;
          centerY = startY;
        } else {
          const w = pos.x - startX;
          const h = pos.y - startY;
          centerX = startX + w / 2;
          centerY = startY + h / 2;
          radiusX = Math.abs(w / 2);
          radiusY = Math.abs(h / 2);
        }

        if (isShift) {
          const r = Math.max(radiusX, radiusY);
          radiusX = r;
          radiusY = r;
        }

        updateElement(lastElement.id, {
          x: centerX,
          y: centerY,
          radiusX,
          radiusY,
        });
        break;
      }
      case "erase": {
        const { elements: currentElements, removeElement } =
          useAppStore.getState();
        const hit = currentElements.find((el) => hitTestElement(el, pos));
        if (hit) removeElement(hit.id);
        break;
      }
    }
  };

  const handleMouseUp = () => {
    const {
      isDrawing,
      elements,
      updateElement,
      setIsDrawing,
      endBatch,
      // setActiveTool,
      setSelectedElementId,
    } = useAppStore.getState();

    if (isDrawing) {
      const lastElement = elements[elements.length - 1];
      if (lastElement) {
        updateElement(lastElement.id, { draggable: true });
      }
      setIsDrawing(false);
      endBatch();
      drawStartPos.current = null;
      // setActiveTool("none"); // TODO: Need user feedback on whether to keep tool active after drawing or not
      setSelectedElementId(null);
    }

    const stage = stageRef.current;
    if (stage) stage.draggable(false);
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
}
