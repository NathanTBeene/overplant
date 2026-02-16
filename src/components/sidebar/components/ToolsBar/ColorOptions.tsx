import { Plus } from "lucide-react";

interface ColorOptionsProps {
  selectedColor?: string;
  onSelectColor?: (color: string) => void;
}

export const ColorOptions = ({ selectedColor = "#000000", onSelectColor }: ColorOptionsProps) => {
  const testColors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#000000",
    "#FFFFFF",
    "#808080",
    "#800000",
    "#008000",
  ];

  const colorButton = (color: string, isSelected: boolean) => (
    <button
      key={color}
      className={`w-6 h-6 rounded-sm hover:brightness-110 cursor-pointer hover:scale-110 transition-all duration-150
        ${isSelected ? "ring-2 ring-accent-active" : ""}`}
      style={{ backgroundColor: color }}
      onClick={() => onSelectColor && onSelectColor(color)}
    />
  );

  return (
    <div className="w-full flex justify-between items-center mt-5">
      <label className="text-sm font-medium w-30">Color</label>
      <div className="grid grid-cols-6 gap-x-3 gap-y-1">
        {testColors.map((color) => colorButton(color, color === selectedColor))}
        <button className="w-6 h-6 rounded-sm bg-accent text-lg flex items-center justify-center hover:bg-accent-hover cursor-pointer">
          <Plus size={18} color="white" />
        </button>
      </div>
    </div>
  );
};

export default ColorOptions;
