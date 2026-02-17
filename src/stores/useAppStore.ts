import type { ToolType } from "@/components/sidebar/components/ToolsBar";
import type { BrushType } from "@/components/sidebar/components/ToolsBar/BrushTypeSelector";
import type { HeroInfo } from "@/lib/heroInfo";
import { getInitialMapSettings, type Map } from "@/lib/mapInfo";
import {create} from "zustand";
import { stageRef } from "./stageRef";
import type { MapElement } from "@/types/MapElement";

/* ------------------------------ TOOL SETTINGS ----------------------------- */

export interface PenSettings {
  brushType: BrushType;
  color: string;
  opacity: number;
  brushSize: number;
  dashPattern: number[];
  pointer: { length: number; width: number };
  maxAnchors: number;
  minAnchorStep: number;
}

export interface ShapeSettings {
  brushType: BrushType;
  color: string;
  fill: string;
  strokeWidth: number;
  borderRadius: number;
  opacity: number;
  dashPattern: number[];
}

export interface TextSettings {
  color: string;
  fontSize: number;
  fontFamily: string;
  opacity: number;
}

export interface ToolSettings {
  pen: PenSettings;
  shape: ShapeSettings;
  text: TextSettings;
}

const makeToolSettings = (): ToolSettings => ({
  pen: {
    brushType: "line",
    color: "#000000",
    opacity: 100,
    brushSize: 16,
    dashPattern: [50, 15],
    pointer: { length: 20, width: 40 },
    maxAnchors: 10,
    minAnchorStep: 10,
  },
  shape: {
    brushType: "line",
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
  },
});

/* -------------------------------- APP STATE ------------------------------- */

const MAX_HISTORY_SIZE = 50;

export interface AppState {
  // Stage Transform
  stageScale: number;
  stagePosition: { x: number; y: number };
  stageDimensions: { width: number; height: number };

  setStageScale: (scale: number) => void;
  setStagePosition: (position: { x: number; y: number }) => void;
  setStageDimensions: (dimensions: { width: number; height: number }) => void;
  setInitialStageSettings: (map: Map) => void;

  // Elements
  elements: MapElement[];
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  addElement: (element: MapElement, startDragging?: boolean) => void;
  updateElement: (id: string, updates: Partial<MapElement>) => void;
  removeElement: (id: string) => void;
  clearElements: () => void;
  addHero: (info: HeroInfo) => void;

  // Drawing
  isDrawing: boolean;
  activeTool: ToolType;
  toolSettings: ToolSettings;
  setIsDrawing: (isDrawing: boolean) => void;
  setActiveTool: (tool: ToolType) => void;
  setToolSettings: (settings: ToolSettings) => void;

  // History
  past: MapElement[][];
  future: MapElement[][];
  pushToHistory: (snapshot: MapElement[]) => void;
  undo: () => void;
  redo: () => void;
  startBatch: () => void;
  endBatch: () => void;
  clearHistory: () => void;
  _batchStartSnapshot: MapElement[] | null; // Internal use for batching

  // Map
  mapSide: "Attack" | "Defense";
  toggleMapSide: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Stage Transform
  stageScale: 1,
  stagePosition: { x: 0, y: 0 },
  stageDimensions: { width: 800, height: 600 },
  setStageScale: (scale) => set({ stageScale: scale }),
  setStagePosition: (position) => set({ stagePosition: position }),
  setStageDimensions: (dimensions) => set({ stageDimensions: dimensions }),
  setInitialStageSettings: (map) => {
    const settings = getInitialMapSettings(map.id, get().mapSide);
    if (settings) {
      set({
        stageScale: settings.scale,
        stagePosition: settings.position,
      });
    }
  },

  // Elements
  elements: [],
  selectedElementId: null,
  setSelectedElementId: (id) => set({ selectedElementId: id }),

  addElement: (element, startDragging = false) => {
    const { _batchStartSnapshot, elements, pushToHistory } = get();
    if (_batchStartSnapshot === null) {
      pushToHistory(elements);
    }
    set({ elements: [...elements, element] });

    if (startDragging) {
      setTimeout(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const node = stage.findOne(`#${element.id}`);
        if (node) node.startDrag();
      });
    }
  },

  updateElement: (id, updates) => {
    set((s) => ({
      elements: s.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }));
  },

  removeElement: (id) => {
    const { _batchStartSnapshot, elements, pushToHistory } = get();
    if (_batchStartSnapshot === null) {
      pushToHistory(elements);
    }
    set((s) => ({
      elements: s.elements.filter((el) => el.id !== id),
    }));
  },

  clearElements: () => {
    const { _batchStartSnapshot, elements, pushToHistory } = get();
    if (_batchStartSnapshot === null) {
      pushToHistory(elements);
    }
    set({ elements: [] });
  },

  addHero: (info) => {
    const stage = stageRef.current;
    if (!stage) return;

    const point = stage.getPointerPosition();
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const canvasCoords = point
      ? transform.point(point)
      : { x: stage.width() / 2, y: stage.height() / 2 };

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

    get().addElement(heroElement);
  },

  // Drawing
  isDrawing: false,
  activeTool: "none" as ToolType,
  toolSettings: makeToolSettings(),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setToolSettings: (settings) => set({ toolSettings: settings }),

  // History
  past: [],
  future: [],
  _batchStartSnapshot: null,

  pushToHistory: (snapshot) => {
    set((s) => {
      const past = [...s.past];
      // Skip if identical to last snapshot
      if (past.length > 0) {
        const last = past[past.length - 1];
        if (JSON.stringify(last) === JSON.stringify(snapshot)) {
          return {};
        }
      }

      if (past.length >= MAX_HISTORY_SIZE) {
        past.shift();
      }

      past.push(snapshot);
      return { past };
    })
  },

  undo: () =>
    set((s) => {
      if (s.past.length === 0) return {};
      const past = [...s.past];
      const previous = past.pop()!;
      return {
        past,
        future: [...s.future, s.elements],
        elements: previous,
        selectedElementId: null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return {};
      const future = [...s.future];
      const next = future.pop()!;
      return {
        future,
        past: [...s.past, s.elements],
        elements: next,
        selectedElementId: null,
      };
    }),

  startBatch: () =>
    set((s) => ({ _batchStartSnapshot: [...s.elements] })),

  endBatch: () => {
    const { _batchStartSnapshot, pushToHistory } = get();
    if (_batchStartSnapshot) {
      pushToHistory(_batchStartSnapshot);
      set({ _batchStartSnapshot: null, future: [] });
    }
  },

  clearHistory: () => set({ past: [], future: [] }),

  // Map
  mapSide: "Attack",
  toggleMapSide: () => {
    set((s) => {
      const newSide = s.mapSide === "Attack" ? "Defense" : "Attack";
      const stage = stageRef.current;
      if (!stage) return { mapSide: newSide };

      const mapImage = stage.findOne("Image");
      if (!mapImage) return { mapSide: newSide };

      const imageWidth = mapImage.width() || 0;
      const imageHeight = mapImage.height() || 0;

      // Push current to history before flipping
      const past = [...s.past];
      if (past.length >= MAX_HISTORY_SIZE) past.shift();
      past.push(s.elements);

      const flippedElements = s.elements.map((el) => ({
        ...el,
        x: imageWidth - (el.x || 0) - (el.width || 0),
        y: imageHeight - (el.y || 0) - (el.height || 0),
      }));

      return {
        mapSide: newSide,
        elements: flippedElements,
        past
      }
    });
  }
}));
