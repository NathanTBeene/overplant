import SidebarHeader from "./SidebarHeader";
import {
  Pen,
  Eraser,
  TextSelect,
  Image,
  SquareDashed,
  CircleDashed,
  SplinePointer,
  Ellipsis,
} from "lucide-react";
import PenTool from "./ToolsBar/PenTool";
import ShapeTool from "./ToolsBar/ShapeTool";
import EraseTool from "./ToolsBar/EraseTool";
import TextTool from "./ToolsBar/TextTool";
import ImageTool from "./ToolsBar/ImageTool";

export type ToolType =
  | "pen"
  | "erase"
  | "text"
  | "image"
  | "rectangle"
  | "circle"
  | "line"
  | "icons"
  | "none";

interface ToolsBarProps {
  selectedTool?: ToolType;
  onSelectTool?: (tool: ToolType) => void;
  onDeselectTool?: () => void;
}

const ToolsBar = ({
  selectedTool = "none",
  onSelectTool,
  onDeselectTool,
}: ToolsBarProps) => {
  const handleSelectTool = (tool: ToolType) => {
    if (tool === selectedTool) {
      if (onDeselectTool) {
        console.log("deselecting tool");
        onDeselectTool();
      }
    } else {
      if (onSelectTool) {
        console.log("selecting tool:", tool);
        onSelectTool(tool);
      }
    }
  };

  const toolOptions = () => {
    switch (selectedTool) {
      case "pen":
        return <PenTool />;
      case "line":
      return <PenTool />
      case "erase":
        return <EraseTool />
      case "text":
        return <TextTool />
      case "image":
        return <ImageTool />
      case "rectangle":
        return <ShapeTool />;
      case "circle":
        return <ShapeTool />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <SidebarHeader title="Tools" tooltip="Select a tool" />
      <div className="grid grid-cols-4 gap-2 py-2">
        <ToolButton
          icon={<Pen size={20} />}
          isSelected={selectedTool === "pen"}
          onSelect={() => handleSelectTool("pen")}
          tooltip="Pen"
        />
        <ToolButton
          icon={<Eraser size={20} />}
          isSelected={selectedTool === "erase"}
          onSelect={() => handleSelectTool("erase")}
          tooltip="Erase"
        />
        <ToolButton
          icon={<TextSelect size={20} />}
          isSelected={selectedTool === "text"}
          onSelect={() => handleSelectTool("text")}
          tooltip="Text"
        />
        <ToolButton
          icon={<Image size={20} />}
          isSelected={selectedTool === "image"}
          onSelect={() => handleSelectTool("image")}
          tooltip="Image"
        />
        <ToolButton
          icon={<SquareDashed size={20} />}
          isSelected={selectedTool === "rectangle"}
          onSelect={() => handleSelectTool("rectangle")}
          tooltip="Rectangle"
        />
        <ToolButton
          icon={<CircleDashed size={20} />}
          isSelected={selectedTool === "circle"}
          onSelect={() => handleSelectTool("circle")}
          tooltip="Circle"
        />
        <ToolButton
          icon={<SplinePointer size={20} />}
          isSelected={selectedTool === "line"}
          onSelect={() => handleSelectTool("line")}
          tooltip="Line"
        />
        <ToolButton
          icon={<Ellipsis size={20} />}
          isSelected={selectedTool === "icons"}
          onSelect={() => handleSelectTool("icons")}
          tooltip="Icons"
        />
      </div>

      {/* Tool Options */}
      {toolOptions()}
    </div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  tooltip?: string;
}

const ToolButton = ({icon, isSelected, onSelect, tooltip}: ToolButtonProps) => {
  return (
    <button
      className={`p-3 rounded-md ${
        isSelected
          ? "bg-accent hover:bg-accent-hover"
          : "bg-fill hover:bg-fill-hover"
      }
      cursor-pointer flex items-center justify-center transition-all duration-200 relative group`}
      onClick={onSelect}
    >
      {/* Tooltip */}
      {tooltip && (<div className="absolute -top-9 z-100 bg-background-secondary border border-border px-3 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {tooltip}
      </div>)}
      {icon}
    </button>
  );
};

export default ToolsBar;
