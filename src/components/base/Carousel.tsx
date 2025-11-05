import { useRef, useState, useEffect, useCallback } from "react";

interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
  className?: string;
}

const Carousel = ({
  children,
  itemsPerView = 3,
  className = "",
}: CarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const totalItems = children.length;
  const totalGroups = Math.ceil(totalItems / itemsPerView);

  // Calculate item width based on container width
  useEffect(() => {
    const updateItemWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setItemWidth(containerWidth / itemsPerView);
      }
    };

    updateItemWidth();
    window.addEventListener("resize", updateItemWidth);
    return () => window.removeEventListener("resize", updateItemWidth);
  }, [itemsPerView]);

  const scrollToGroup = useCallback(
    (groupIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(groupIndex, totalGroups - 1));
      setCurrentIndex(clampedIndex);
    },
    [totalGroups]
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();

      if (event.deltaY > 0) {
        // Scroll down/right - next group
        scrollToGroup(currentIndex + 1);
      } else {
        // Scroll up/left - previous group
        scrollToGroup(currentIndex - 1);
      }
    },
    [currentIndex, scrollToGroup]
  );

  const translateX = -(currentIndex * itemsPerView * itemWidth);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onWheel={handleWheel}
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${translateX}px)`,
          width: `${totalItems * itemWidth}px`,
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="shrink-0"
            style={{ width: `${itemWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
