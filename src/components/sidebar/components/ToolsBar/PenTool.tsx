import ValueSlider from "@/components/base/ValueSlider";
import BrushTypeSelector from "./BrushTypeSelector";
import { type BrushType } from './BrushTypeSelector';
import ColorOptions from "./ColorOptions";
import { useAppStore } from "@/stores/useAppStore";

const PenTool = () => {


  const toolSettings = useAppStore((s) => s.toolSettings);
  const setToolSettings = useAppStore((s) => s.setToolSettings);

  const handleOpacityChange = (value: number[]) => {
    setToolSettings({
      ...toolSettings,
      pen: {
        ...toolSettings.pen,
        opacity: value[0],
      }
    });
  };

  const handleBrushSizeChange = (value: number[]) => {
    setToolSettings({
      ...toolSettings,
      pen: {
        ...toolSettings.pen,
        brushSize: value[0] * 4,
      }
    });
  }

  const handleSelectBrushType = (type: BrushType) => {
    setToolSettings({
      ...toolSettings,
      pen: {
        ...toolSettings.pen,
        brushType: type,
      }
    });
  }

  const handleSelectColor = (color: string) => {
    setToolSettings({
      ...toolSettings,
      pen: {
        ...toolSettings.pen,
        color: color,
      }
    });
  };

  return (
    <div className="my-2">
      {/* Brush Type */}
      <BrushTypeSelector selectedBrushType={toolSettings.pen.brushType} onSelectBrushType={handleSelectBrushType} />

      {/* Color Options */}
      <ColorOptions selectedColor={toolSettings.pen.color} onSelectColor={handleSelectColor} />

      {/* Opacity Slider */}
      <div className="w-full flex justify-between items-center mt-5">
        <label className="text-sm font-medium w-30">Opacity</label>
        <ValueSlider
          onValueChange={handleOpacityChange}
          startingValue={toolSettings.pen.opacity}
          min={0}
          max={100}
          step={10}
          type="percent"
        />
      </div>

      {/* Brush Size Slider */}
      <div className="w-full flex justify-between items-center mt-5">
        <label className="text-sm font-medium w-30">Thickness</label>
        <ValueSlider
          onValueChange={handleBrushSizeChange}
          startingValue={toolSettings.pen.brushSize / 4}
          min={1}
          max={10}
          step={1}
        />
      </div>
    </div>
  );
};





export default PenTool;
