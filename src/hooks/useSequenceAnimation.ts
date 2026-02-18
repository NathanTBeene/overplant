import { stageRef } from "@/stores/stageRef";
import { useAppStore } from "@/stores/useAppStore";
import type { MapElement } from "@/types/MapElement";
import { useCallback } from "react";


const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
}

const applyEasing = (t: number, type: string) => {
  switch (type) {
    case "ease-in":
      return t * t;
    case "ease-out":
      return t * (2 - t);
    case "ease-in-out":
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case "spring":
      return 1 - Math.cos(t * Math.PI * 4) * Math.exp(-t * 5);
    default:
      return t;
  }
}

const lerpPoints = (a: number[], b: number[], t: number): number[] => {
  const len = Math.max(a.length, b.length);
  const result: number[] = [];
  for (let i = 0; i < len; i++) {
    result.push(lerp(a[i] ?? b[i] ?? 0, b[i] ?? a[i] ?? 0, t));
  }
  return result;
};

const interpolateElements = (
  from: MapElement[],
  to: MapElement[],
  t: number
): MapElement[] => {
  const fromMap = new Map(from.map((el) => [el.id, el]));
  const toMap = new Map(to.map((el) => [el.id, el]));
  const result: MapElement[] = [];

  // Moved or entering elements
  for (const toEl of to) {
    const fromEl = fromMap.get(toEl.id);
    if (fromEl) {
      // Moved: interpolate all numeric positional/style props
      const fromOpacity = (fromEl.opacity ?? 100);
      const toOpacity = (toEl.opacity ?? 100);
      result.push({
        ...toEl,
        x: fromEl.x !== undefined && toEl.x !== undefined ? lerp(fromEl.x, toEl.x, t) : toEl.x,
        y: fromEl.y !== undefined && toEl.y !== undefined ? lerp(fromEl.y, toEl.y, t) : toEl.y,
        width: fromEl.width !== undefined && toEl.width !== undefined ? lerp(fromEl.width, toEl.width, t) : toEl.width,
        height: fromEl.height !== undefined && toEl.height !== undefined ? lerp(fromEl.height, toEl.height, t) : toEl.height,
        radiusX: fromEl.radiusX !== undefined && toEl.radiusX !== undefined ? lerp(fromEl.radiusX, toEl.radiusX, t) : toEl.radiusX,
        radiusY: fromEl.radiusY !== undefined && toEl.radiusY !== undefined ? lerp(fromEl.radiusY, toEl.radiusY, t) : toEl.radiusY,
        strokeWidth: fromEl.strokeWidth !== undefined && toEl.strokeWidth !== undefined ? lerp(fromEl.strokeWidth, toEl.strokeWidth, t) : toEl.strokeWidth,
        opacity: lerp(fromOpacity, toOpacity, t),
        points: fromEl.points && toEl.points ? lerpPoints(fromEl.points, toEl.points, t) : toEl.points,
      });
    } else {
      // Entering: fade in
      result.push({ ...toEl, opacity: lerp(0, toEl.opacity ?? 100, t) });
    }
  }

  // Exiting: fade out (keep rendering until fully transparent)
  for (const fromEl of from) {
    if (!toMap.has(fromEl.id)) {
      const exitOpacity = lerp(fromEl.opacity ?? 100, 0, t);
      if (exitOpacity > 0.5) {
        result.push({ ...fromEl, opacity: exitOpacity });
      }
    }
  }

  return result;
};

export const useSequenceAnimation = () => {
  const switchSequence = useCallback((newIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      const state = useAppStore.getState();
      const { isAnimating, activeSequenceIndex, elements: fromElements, sequences, settings } = state;

      if (isAnimating || newIndex === activeSequenceIndex) {
        resolve();
        return;
      }

      // Capture thumbnail of current sequence
      const stage = stageRef.current;
      if (stage) {
        const thumbnail = stage.toDataURL({ pixelRatio: 0.15 });
        useAppStore.getState().updateSequenceThumbnail(activeSequenceIndex, thumbnail);
      }

      // Save current elements to current sequence
      useAppStore.getState().saveCurrentToSequence();

      // Determine target elements (copy current if first visit)
      const targetSeq = sequences[newIndex];
      const toElements = targetSeq.elements.length === 0
        ? fromElements.map((el) => ({ ...el }))
        : targetSeq.elements;

      // Block input and clear selection/history
      useAppStore.setState({
        isAnimating: true,
        selectedElementId: null,
        past: [],
        future: [],
      });

      const { sequenceTransitionDuration, sequenceEasing } = settings;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const rawT = Math.min(elapsed / sequenceTransitionDuration, 1);
        const t = applyEasing(rawT, sequenceEasing);

        const interpolated = interpolateElements(fromElements, toElements, t);
        useAppStore.setState({ elements: interpolated });

        if (rawT < 1) {
          requestAnimationFrame(animate);
        } else {
          useAppStore.setState({
            elements: toElements,
            activeSequenceIndex: newIndex,
            isAnimating: false,
          });
          useAppStore.getState().saveCurrentToSequence();
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }, []);

  return { switchSequence };
};
