import BrushTypeSelector, { type BrushType } from "./BrushTypeSelector";
import ValueSlider from "@/components/base/ValueSlider";
import ColorOptions from "./ColorOptions";
import { useAppStore } from "@/stores/useAppStore";


const ShapeTool = () => {

  const toolSettings = useAppStore((s) => s.toolSettings);
  const setToolSettings = useAppStore((s) => s.setToolSettings);

  const handleOpacityChange = (value: number[]) => {
    setToolSettings({
      ...toolSettings,
      shape: {
        ...toolSettings.shape,
        opacity: value[0],
      }
    });
  };

  const handleBrushSizeChange = (value: number[]) => {
    setToolSettings({
      ...toolSettings,
      shape: {
        ...toolSettings.shape,
        strokeWidth: value[0] * 4,
      }
    });
  }

  const handleSelectBrushType = (type: BrushType) => {
    setToolSettings({
      ...toolSettings,
      shape: {
        ...toolSettings.shape,
        brushType: type,
      }
    });
  }

  const handleSelectColor = (color: string) => {
    setToolSettings({
      ...toolSettings,
      shape: {
        ...toolSettings.shape,
        color: color,
      }
    });
  };

  return (
    <div className="my-2">
      {/* Brush Type */}
      <BrushTypeSelector selectedBrushType={toolSettings.shape.brushType} onSelectBrushType={handleSelectBrushType} allowArrows={false}/>

      {/* Color Options */}
      <ColorOptions selectedColor={toolSettings.shape.color} onSelectColor={handleSelectColor} />

      {/* Opacity Slider */}
      <div className="w-full flex justify-between items-center mt-5">
        <label className="text-sm font-medium w-30">Opacity</label>
        <ValueSlider
          onValueChange={handleOpacityChange}
          startingValue={toolSettings.shape.opacity}
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
          startingValue={toolSettings.shape.strokeWidth / 4}
          min={1}
          max={10}
          step={1}
        />
      </div>
    </div>
  );
}

export default ShapeTool
