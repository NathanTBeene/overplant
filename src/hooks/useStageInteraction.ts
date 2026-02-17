import { useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { useAppStore } from "@/stores/useAppStore";
import { stageRef } from "@/stores/stageRef";

export const useStageInteraction = () => {
  const [isDragging, setIsDragging] = useState(false);

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

    const { setStageScale, setStagePosition } = useAppStore.getState();
    setStageScale(newScale);
    setStagePosition(newPos);
  };

  const handleDragStart = (e: KonvaEventObject<globalThis.DragEvent>) => {
    if (e.target !== stageRef.current) return;
    const { isDrawing, activeTool } = useAppStore.getState();
    if (isDrawing || activeTool !== "none") return;
    setIsDragging(true);
  };

  const handleDragMove = (e: KonvaEventObject<globalThis.DragEvent>) => {
    if (e.target !== stageRef.current) return;
    const { isDrawing, activeTool } = useAppStore.getState();
    if (isDrawing || activeTool !== "none") return;

    const stage = stageRef.current;
    if (!stage) return;
    useAppStore.getState().setStagePosition({ x: stage.x(), y: stage.y() });
  };

  const handleDragEnd = (e: KonvaEventObject<globalThis.DragEvent>) => {
    if (e.target !== stageRef.current) return;
    const { isDrawing, activeTool } = useAppStore.getState();
    if (isDrawing || activeTool !== "none") return;

    const stage = stageRef.current;
    if (!stage) return;
    useAppStore.getState().setStagePosition({ x: stage.x(), y: stage.y() });
    setIsDragging(false);
  };

  return { handleWheel, handleDragStart, handleDragMove, handleDragEnd, isDragging };
};
