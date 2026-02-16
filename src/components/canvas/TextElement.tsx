import { useEffect, useRef, useState } from "react";

const TextElement = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setStartX(e.clientX);
    if (textareaRef.current) {
      setStartWidth(textareaRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !textareaRef.current) return;

      const diff = e.clientX - startX;
      const newWidth = startWidth + diff;
      textareaRef.current.style.width = `${Math.max(100, newWidth)}px`;
      handleInput(); // Recalculate height when width changes
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
  }, [isResizing, startX, startWidth]);

  return (
    <div className="relative w-fit">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Click to Add Text"
        onInput={handleInput}
        className="bg-slate-900 resize-none outline-none overflow-hidden rounded-md p-2 pr-5"
      />
      {/* Grabber */}
      <div
        className="absolute top-1 bottom-2.5 right-1 w-1 bg-white rounded-full cursor-ew-resize"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

export default TextElement
