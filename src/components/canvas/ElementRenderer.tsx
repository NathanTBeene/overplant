import { Line, Arrow, Rect, Image, Ellipse } from "react-konva";
import useImage from "use-image";
import type { KonvaEventObject } from "konva/lib/Node";
import type { MapElement } from "@/types/MapElement";
import { useAppStore } from "@/stores/useAppStore";

interface ElementRendererProps {
  element: MapElement;
  onDragEnd?: (id: string, x: number, y: number) => void;
}

const ElementRenderer = ({ element, onDragEnd }: ElementRendererProps) => {
    const activeTool = useAppStore((s) => s.activeTool);
    const updateElement = useAppStore((s) => s.updateElement);
    const mapSide = useAppStore((s) => s.mapSide);
    const isDefense = mapSide === "Defense";


    const isToolActive = activeTool !== "none";

    const [image] = useImage(element.type === "image" ? element.src ?? "" : "");


    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const { elements, pushToHistory } = useAppStore.getState();
      pushToHistory(elements);

      if ((element.type === "line" || element.type === "arrow") && element.points) {
        const offsetX = node.x();
        const offsetY = node.y();

        if (offsetX !== 0 || offsetY !== 0) {
          const newPoints = element.points.map((val, i) =>
            i % 2 === 0 ? val + offsetX : val + offsetY
          );

          node.x(0);
          node.y(0);

          updateElement(element.id, { points: newPoints });
        }
      } else {
        onDragEnd?.(element.id, node.x(), node.y());
      }
    };

  const commonProps = {
    id: element.id,
    draggable: element.draggable && !isToolActive,
    onDragEnd: handleDragEnd,
    onmouseenter: (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;
      const container = stage.container();
      container.style.cursor = isToolActive ? "default" : "move";
    },
    onmouseleave: (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;
      const container = stage.container();
      container.style.cursor = "default";
    },
  };

  const opacity = element.opacity ? element.opacity / 100 : 1;

  switch (element.type) {
    case "line":
      return (
        <Line
          {...commonProps}
          points={element.points ?? []}
          stroke={element.color}
          strokeWidth={element.strokeWidth ?? 2}
          dash={element.dash}
          opacity={opacity}
        />
      );

    case "arrow":
      return (
        <Arrow
          {...commonProps}
          points={element.points ?? []}
          stroke={element.color}
          fill={element.color}
          strokeWidth={element.strokeWidth}
          pointerLength={element.pointerLength ?? 10}
          pointerWidth={element.pointerWidth ?? 8}
          dash={element.dash}
          opacity={opacity}
        />
      );

    case "rectangle":
      return (
        <Rect
          {...commonProps}
          x={element.x ?? 0}
          y={element.y ?? 0}
          width={element.width ?? 100}
          height={element.height ?? 100}
          fill={element.fill}
          stroke={element.color}
          strokeWidth={element.strokeWidth}
          cornerRadius={element.borderRadius}
          dash={element.dash}
          opacity={opacity}
        />
      );

    case "circle":
      return (
        <Ellipse
          {...commonProps}
          x={element.x ?? 0}
          y={element.y ?? 0}
          radiusX={element.radiusX ?? element.radius ?? 50}
          radiusY={element.radiusY ?? element.radius ?? 50}
          fill={element.fill}
          stroke={element.color}
          strokeWidth={element.strokeWidth}
          dash={element.dash}
          opacity={opacity}
        />
      );

    case "text":
      // TODO: implement
      return (
        <></>
      );

    case "image":
      return (
        <Image
          {...commonProps}
          // Shift x/y to compensate for flipping
          x={(element.x ?? 0) + (isDefense ? (element.width ?? 0) / 2 : 0)}
          y={(element.y ?? 0) + (isDefense ? (element.height ?? 0) / 2 : 0)}
          width={element.width}
          height={element.height}
          image={image}
          fill={element.backgroundColor}
          cornerRadius={element.borderRadius}
          // Counter Rotate so images stay upright when map is flipped
          rotation={isDefense ? 180 : 0}
          offsetX={isDefense ? (element.width ?? 0) / 2 : 0}
          offsetY={isDefense ? (element.height ?? 0) / 2 : 0}
        />
      );

    default:
      return null;
  }
};

export default ElementRenderer;
