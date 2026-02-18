import type { AppState } from "@/stores/useAppStore";

export const selectStageScale = (s: AppState) => s.stageScale;
export const selectStagePosition = (s: AppState) => s.stagePosition;
export const selectStageDimensions = (s: AppState) => s.stageDimensions;
export const selectElements = (s: AppState) => s.elements;
export const selectSelectedElementId = (s: AppState) => s.selectedElementId;
export const selectActiveTool = (s: AppState) => s.activeTool;
export const selectToolSettings = (s: AppState) => s.toolSettings;
export const selectPenSettings = (s: AppState) => s.toolSettings.pen;
export const selectShapeSettings = (s: AppState) => s.toolSettings.shape;
export const selectIsDrawing = (s: AppState) => s.isDrawing;
export const selectMapSide = (s: AppState) => s.mapSide;
export const selectCanUndo = (s: AppState) => s.past.length > 0;
export const selectCanRedo = (s: AppState) => s.future.length > 0;
export const selectSequences = (s: AppState) => s.sequences;
export const selectActiveSequenceIndex = (s: AppState) => s.activeSequenceIndex;
export const selectIsPlaying = (s: AppState) => s.isPlaying;
export const selectIsAnimating = (s: AppState) => s.isAnimating;
