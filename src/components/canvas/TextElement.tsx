import { useAppStore } from "@/stores/useAppStore";
import type { MapElement } from "@/types/MapElement";
import { useEffect, useRef, useState } from "react";
import { useCallback } from 'react';

interface TextElementProps {
  element: MapElement;
  onUpdate: (id: string, updates: Partial<MapElement>) => void;
  stageScale: number;
  stagePosition: { x: number; y: number };
}

const TextElement = ({
  element,
  onUpdate,
  stageScale,
  stagePosition,
}: TextElementProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(element.isEditing ?? false);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(element.width ?? 200);
  const [text, setText] = useState(element.text ?? "");

  const mapSide = useAppStore((s) => s.mapSide);
  const mapImageSize = useAppStore((s) => s.mapImageSize);
  const activeTool = useAppStore((s) => s.activeTool);
  const isToolActive = activeTool !== "none";

  const isDefense = mapSide === "Defense";
  const visualX = isDefense ? mapImageSize.width - (element.x ?? 0) : (element.x ?? 0);
  const visualY = isDefense ? mapImageSize.height - (element.y ?? 0) : (element.y ?? 0);
  const screenX = visualX * stageScale + stagePosition.x;
  const screenY = visualY * stageScale + stagePosition.y;

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.width = `${width}px`;
    }
  }, [width]); // Add width as a dependency since it's used inside

  const handleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("resize-grabber")) return;
    setIsEditing(true);
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }
    }, 0);
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("resize-grabber")) {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(width);
    } else if (!isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onUpdate(element.id, { text: e.target.value });
    handleInput();
  }

  // Measure and Store rendered height
  useEffect(() => {
    const el = isEditing ? textareaRef.current : displayRef.current;
    if (el) {
      onUpdate(element.id, { height: el.offsetHeight * 3 });
    }
  }, [text, width, isEditing, onUpdate, element.id]);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        handleInput();
      }, 0);
    }
  }, [handleInput, isEditing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isEditing && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false);
        onUpdate(element.id, { isEditing: false });
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false);
        onUpdate(element.id, { isEditing: false });
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing, element.id, onUpdate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const diff = e.clientX - startX;
        const newWidth = Math.max(100, startWidth + diff);
        setWidth(newWidth);
        onUpdate(element.id, { width: newWidth });

        if (isEditing && textareaRef.current) {
          handleInput();
        }
      } else if (isDragging) {
        const sign = isDefense ? -1 : 1;
        const dx = sign * (e.clientX - dragStart.x) / stageScale;
        const dy = sign * (e.clientY - dragStart.y) / stageScale;

        onUpdate(element.id, {
          x: (element.x ?? 0) + dx,
          y: (element.y ?? 0) + dy,
        });

        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
    };

    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging, startX, startWidth, isEditing, dragStart, stageScale, element.id, element.x, element.y, onUpdate, handleInput, isDefense]);

  return (
    <div
      ref={containerRef}
      className="absolute w-fit z-1000"
      style={{
        left: `${screenX}px`,
        top: `${screenY}px`,
        transform: `scale(${stageScale * 3}) translate(-50%, -50%)`,
        transformOrigin: 'top left',
        cursor: isDragging ? 'grabbing' : isEditing ? 'default' : 'grab',
        pointerEvents: isToolActive ? 'none' : 'auto',
      }}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      {isEditing ? (
        <>
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            placeholder="Click to Add Text"
            onChange={handleTextChange}
            style={{ width: `${width}px` }}
            className="bg-slate-900 resize-none outline-none overflow-hidden rounded-md p-2 pr-5"
          />
          <div
            className="resize-grabber absolute top-1 bottom-2.5 right-1 w-1 bg-white rounded-full cursor-ew-resize"
            onMouseDown={handleMouseDown}
          />
        </>
      ) : (
        <>
          <div
            ref={displayRef}
            style={{ width: `${width}px` }}
            className="bg-slate-900 rounded-md p-2 pr-5 wrap-break-word"
          >
            {text || "Double-click to Add Text"}
          </div>
          <div
            className="resize-grabber absolute top-1 bottom-1 right-1 w-1 bg-white rounded-full cursor-ew-resize"
          />
        </>
      )}
    </div>
  )
}

export default TextElement
