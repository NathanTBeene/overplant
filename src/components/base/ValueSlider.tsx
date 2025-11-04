import { Slider, Tooltip } from "radix-ui";
import { useState } from "react";

interface ValueSliderProps {
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const ValueSlider = ({
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
}: ValueSliderProps) => {
  const [value, setValue] = useState([100]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleValueChange = (newValue: number[]) => {
    setIsTooltipOpen(true);
    setValue(newValue);
    onValueChange(newValue);
  };

  const handleValueCommit = () => {
    setIsTooltipOpen(false);
  };

  return (
    <Slider.Root
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
      className="relative flex items-center select-none touch-none w-full h-5"
    >
      <Slider.Track className="bg-fill relative flex-1 rounded-full h-2 w-full">
        <Slider.Range className="bg-accent h-2 absolute rounded-full" />
      </Slider.Track>
      <Tooltip.Root delayDuration={100} open={isTooltipOpen}>
        <Tooltip.Trigger asChild>
          <Slider.Thumb
            aria-label="opacity"
            className="block w-5 h-5 rounded-full bg-accent hover:bg-accent-hover focus:outline-none shadow-lg cursor-pointer"
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="px-2 py-1 rounded-md bg-background/60 text-white text-sm shadow-lg z-50"
            side="bottom"
            align="center"
            sideOffset={8}
          >
            {value[0]}%
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Slider.Root>
  );
};

export default ValueSlider;
