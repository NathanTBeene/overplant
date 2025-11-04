import { Line, Arrow, Rect, Circle, Text, Image } from "react-konva";
import type { MapElement } from "./MapCanvas";
import useImage from "use-image";

interface ElementRendererProps {
  element: MapElement;
  onDragEnd?: (id: string, x: number, y: number) => void;
}

const ElementRenderer = ({ element, onDragEnd }: ElementRendererProps) => {
  const handleDragEnd = (e: any) => {
    onDragEnd?.(element.id, e.target.x(), e.target.y());
  };

  const commonProps = {
    id: element.id,
    draggable: element.draggable ?? false,
    onDragEnd: handleDragEnd,
  };

  switch (element.type) {
    case "line":
      return (
        <Line
          {...commonProps}
          points={element.points ?? []}
          stroke={element.color}
          strokeWidth={element.strokeWidth ?? 2}
        />
      );

    case "arrow":
      return (
        <Arrow
          {...commonProps}
          points={element.points ?? []}
          stroke={element.color}
          fill={element.color}
          strokeWidth={element.strokeWidth ?? 2}
          pointerLength={10}
          pointerWidth={8}
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
          strokeWidth={element.strokeWidth ?? 1}
        />
      );

    case "circle":
      return (
        <Circle
          {...commonProps}
          x={element.x ?? 0}
          y={element.y ?? 0}
          radius={element.radius ?? 50}
          radiusX={element.radiusX}
          radiusY={element.radiusY}
          fill={element.fill}
          stroke={element.color}
          strokeWidth={element.strokeWidth ?? 1}
        />
      );

    case "text":
      return (
        <Text
          {...commonProps}
          x={element.x ?? 0}
          y={element.y ?? 0}
          text={element.text ?? "Text"}
          fontSize={element.fontSize ?? 16}
          fontFamily={element.fontFamily ?? "Arial"}
          fill={element.color}
        />
      );

    case "image":
      return (
        <Image
          {...commonProps}
          x={element.x ?? 0}
          y={element.y ?? 0}
          width={element.width}
          height={element.height}
          image={useImage(element.src ?? "")[0]}
          fill={element.backgroundColor}
          cornerRadius={element.borderRadius}
        />
      );

    default:
      return null;
  }
};

export default ElementRenderer;
