export interface MapElement {
  id: string;
  type: "line" | "arrow" | "rectangle" | "circle" | "text" | "image" | "hero";
  draggable?: boolean;
  // Lines and Arrows
  points?: number[];
  dash?: number[]; // for dashed lines
  // Positioned Elements
  x?: number;
  y?: number;
  // Shapes
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  // Text
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  isEditing?: boolean;
  // Common Styles
  color?: string;
  fill?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;
  opacity?: number;
  // Image
  src?: string;
  // Arrow Properties
  pointerLength?: number;
  pointerWidth?: number;
}
