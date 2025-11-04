import type { HeroInfo } from "@/lib/heroInfo";
import { useStageContext } from "@/providers/AppProvider";
import { useState } from "react";
import { createPortal } from "react-dom";

const HeroPortrait = ({
  hero,
  isAlly,
}: {
  hero: HeroInfo;
  isAlly: boolean;
}) => {
  const { stageScale } = useStageContext();

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleDragStart = (e: any) => {
    setIsDragging(true);
    setDragPosition({ x: e.clientX, y: e.clientY });

    //Pass hero data
    e.dataTransfer.setData("application/hero", JSON.stringify(hero));
    e.dataTransfer.setData("application/isAlly", isAlly.toString());
    e.dataTransfer.effectAllowed = "move";

    // Hide default drag image
    const emptyImg = new Image();
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  };

  const handleDrag = (e: any) => {
    if (e.clientX === 0 && e.clientY === 0) return; // Ignore invalid positions
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (_e: any) => {
    setIsDragging(false);
  };

  const scaledSize = 80 * stageScale;
  const halfSize = scaledSize / 2;

  const customDragPreview = isDragging && (
    <div
      className={`fixed pointer-events-none z-50 rounded-md ${
        isAlly ? "bg-overwatch-ally" : "bg-overwatch-enemy"
      }`}
      style={{
        top: dragPosition.y - halfSize,
        left: dragPosition.x - halfSize,
        width: scaledSize,
        height: scaledSize,
      }}
    >
      <img
        src={hero.portrait}
        alt={hero.name}
        className="w-full h-full rounded-md"
      />
    </div>
  );

  return (
    <>
      <div
        className="w-20 h-20 bg-background-secondary hover:bg-fill rounded-md flex items-center justify-center cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <img
          src={hero.portrait}
          alt={hero.name}
          className="w-20 h-20 pointer-events-none rounded-md"
          draggable={false}
        />
      </div>
      {isDragging && createPortal(customDragPreview, document.body)}
    </>
  );
};

export default HeroPortrait;
