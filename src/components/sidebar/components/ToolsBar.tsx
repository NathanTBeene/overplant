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

interface ToolsBarProps {
  selectedTool?:
    | "pen"
    | "erase"
    | "text"
    | "image"
    | "rectangle"
    | "circle"
    | "line"
    | "icons";
  onSelectTool?: (tool: ToolsBarProps["selectedTool"]) => void;
  onDeselectTool?: () => void;
}

const ToolsBar = ({
  selectedTool = "pen",
  onSelectTool,
  onDeselectTool,
}: ToolsBarProps) => {
  const handleSelectTool = (tool: ToolsBarProps["selectedTool"]) => {
    if (tool === selectedTool) {
      onDeselectTool && onDeselectTool();
    } else {
      onSelectTool && onSelectTool(tool);
    }
  };

  const toolOptions = () => {
    switch (selectedTool) {
      case "pen":
        return <PenTool />;
    }
  };

  return (
    <div className="flex flex-col">
      <SidebarHeader title="Tools" tooltip="Select a tool" />
      <div className="grid grid-cols-4 gap-2 py-2">
        <ToolButton
          tool="pen"
          icon={<Pen size={20} />}
          isSelected={selectedTool === "pen"}
          onSelect={() => handleSelectTool("pen")}
        />
        <ToolButton
          tool="erase"
          icon={<Eraser size={20} />}
          isSelected={selectedTool === "erase"}
          onSelect={() => handleSelectTool("erase")}
        />
        <ToolButton
          tool="text"
          icon={<TextSelect size={20} />}
          isSelected={selectedTool === "text"}
          onSelect={() => handleSelectTool("text")}
        />
        <ToolButton
          tool="image"
          icon={<Image size={20} />}
          isSelected={selectedTool === "image"}
          onSelect={() => handleSelectTool("image")}
        />
        <ToolButton
          tool="rectangle"
          icon={<SquareDashed size={20} />}
          isSelected={selectedTool === "rectangle"}
          onSelect={() => handleSelectTool("rectangle")}
        />
        <ToolButton
          tool="circle"
          icon={<CircleDashed size={20} />}
          isSelected={selectedTool === "circle"}
          onSelect={() => handleSelectTool("circle")}
        />
        <ToolButton
          tool="line"
          icon={<SplinePointer size={20} />}
          isSelected={selectedTool === "line"}
          onSelect={() => handleSelectTool("line")}
        />
        <ToolButton
          tool="icons"
          icon={<Ellipsis size={20} />}
          isSelected={selectedTool === "icons"}
          onSelect={() => handleSelectTool("icons")}
        />
      </div>

      {/* Tool Options */}
      {toolOptions()}
    </div>
  );
};

interface ToolButtonProps {
  tool:
    | "pen"
    | "erase"
    | "text"
    | "image"
    | "rectangle"
    | "circle"
    | "line"
    | "icons";
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (tool: ToolButtonProps["tool"]) => void;
}

const ToolButton = ({ tool, icon, isSelected, onSelect }: ToolButtonProps) => {
  return (
    <button
      className={`p-3 rounded-md ${
        isSelected
          ? "bg-accent hover:bg-accent-hover"
          : "bg-fill hover:bg-fill-hover"
      }
      cursor-pointer flex items-center justify-center transition-all duration-200`}
      onClick={() => onSelect(tool)}
    >
      {icon}
    </button>
  );
};

export default ToolsBar;
