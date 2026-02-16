import { useEffect, useRef, useState } from "react";

const TextElement = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [width, setWidth] = useState(200);
  const [text, setText] = useState("");

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      // Ensure width is maintained
      textarea.style.width = `${width}px`;
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("resize-grabber")) return; // Prevent edit mode when clicking grabber
    setIsEditing(true);
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        // Set cursor to the end of the text
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }
    }, 0);
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(width);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    handleInput();
  }

  useEffect(() => {
    if (isEditing) {
      // Adjust textarea height when entering edit mode
      setTimeout(() => {
        handleInput();
      }, 0);
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isEditing && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false);
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
  }, [isEditing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = e.clientX - startX;
      const newWidth = Math.max(100, startWidth + diff); // Minimum width of 50px
      setWidth(newWidth);

      if (isEditing && textareaRef.current) {
        handleInput(); // Adjust height as well when resizing in edit mode
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startX, startWidth, isEditing]);

  return (
    <div
      ref={containerRef}
      className="relative w-fit"
      onDoubleClick={handleDoubleClick}
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
          {/* Grabber */}
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
            className="bg-slate-900 rounded-md p-2 pr-5 cursor-pointer break-words pointer-events-none user-select-none"
          >
            {text || "Double-click to Add Text"}
          </div>
          {/* Grabber */}
          <div
            className="resize-grabber absolute top-1 bottom-1 right-1 w-1 bg-white rounded-full cursor-ew-resize"
            onMouseDown={handleMouseDown}
          />
        </>
      )}
    </div>
  )
}

export default TextElement
