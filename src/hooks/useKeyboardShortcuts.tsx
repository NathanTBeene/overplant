import { useAppStore } from "@/stores/useAppStore";
import { useEffect } from "react";
import { useSequencePlayback } from "./useSequencePlayback";
import { useSequenceAnimation } from "./useSequenceAnimation";

// Keyboard Shortcuts
// - Undo: Ctrl+Z / Cmd+Z
// - Redo: Ctrl+Y / Cmd+Shift+Z
// - Pen Tool: P
// - Eraser Tool: E
// - Text Tool: T
// - Image Tool: I
// - Rectangle Tool: R
// - Circle Tool: C
// - Line Tool: L
// - Icons Tool: K
// - Clear Tools / Deselect Items: Esc
// - Delete Selected Element: Delete / Backspace (Handled in MapCanvas)


const useKeyboardShortcuts = () => {
  const undo = useAppStore((s) => s.undo);
  const redo = useAppStore((s) => s.redo);
  const canUndo = useAppStore((s) => s.past.length > 0);
  const canRedo = useAppStore((s) => s.future.length > 0);
  const isDrawing = useAppStore((s) => s.isDrawing);
  const activeTool = useAppStore((s) => s.activeTool);
  const setActiveTool = useAppStore((s) => s.setActiveTool);
  const selectedElementId = useAppStore((s) => s.selectedElementId);
  const setSelectedElementId = useAppStore((s) => s.setSelectedElementId);

  const { switchSequence } = useSequenceAnimation();
  const { play: startPlayback, stop: stopPlayback } = useSequencePlayback();


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDrawing) return; // Ignore shortcuts while drawing

      // Sequence navigation
      if (e.key === "[") {
        const { activeSequenceIndex, isAnimating, isPlaying } = useAppStore.getState();
        if (!isAnimating && !isPlaying && activeSequenceIndex > 0) {
          switchSequence(activeSequenceIndex - 1);
        }
        return;
      }
      if (e.key === "]") {
        const { activeSequenceIndex, isAnimating, isPlaying } = useAppStore.getState();
        if (!isAnimating && !isPlaying && activeSequenceIndex < 9) {
          switchSequence(activeSequenceIndex + 1);
        }
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        const { isAnimating, isPlaying } = useAppStore.getState();
        if (!isAnimating) {
          if (isPlaying) stopPlayback();
          else startPlayback();
        }
        return;
      }


      // Dont trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier =  isMac ? e.metaKey : e.ctrlKey;

      // Undo (Ctrl+Z or Cmd+Z)
      if (modifier && e.key === 'z' && !e.shiftKey && canUndo) {
        e.preventDefault();
        undo();
      }

      // Redo (Ctrl+Y or Cmd+Shift+Z)
      if ((modifier && e.key === 'y') || (modifier && e.key === 'Z' && e.shiftKey)) {
        if (canRedo) {
          e.preventDefault();
          redo();
        }
      }

      // Tool Shortcuts
      switch (e.key.toLowerCase()) {
        case 'p':
          setActiveTool(activeTool === "pen" ? "none" : "pen");
          break;
        case 'e':
          setActiveTool(activeTool === "erase" ? "none" : "erase");
          break;
        case 't':
          setActiveTool(activeTool === "text" ? "none" : "text");
          break;
        case 'i':
          setActiveTool(activeTool === "image" ? "none" : "image");
          break;
        case 'r':
          setActiveTool(activeTool === "rectangle" ? "none" : "rectangle");
          break;
        case 'c':
          setActiveTool(activeTool === "circle" ? "none" : "circle");
          break;
        case 'l':
          setActiveTool(activeTool === "line" ? "none" : "line");
          break;
        case 'k':
          setActiveTool(activeTool === "icons" ? "none" : "icons");
          break;
        case 'escape':{
          if (activeTool !== "none") {
            setActiveTool("none");
          }
          if (selectedElementId != null) {
            setSelectedElementId(null);
          }
          break;
        }
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo, isDrawing, activeTool, setActiveTool, selectedElementId, setSelectedElementId, switchSequence, stopPlayback, startPlayback]);
}

export default useKeyboardShortcuts;
