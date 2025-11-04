import ValueSlider from "@/components/base/ValueSlider";

const PenTool = () => {
  const handleOpacityChange = (value: number[]) => {
    console.log("Opacity changed to:", value[0]);
  };

  return (
    <div className="my-2">
      {/* Brush Type */}
      <BrushTypeSelector selectedBrushType="line" />

      {/* Color Options */}

      {/* Opacity Slider */}
      <div className="w-full flex justify-between items-center mt-5">
        <label className="text-sm font-medium w-30">Opacity</label>
        <ValueSlider
          onValueChange={handleOpacityChange}
          min={0}
          max={100}
          step={10}
        />
      </div>

      {/* Brush Size Slider */}
      <div className="w-full flex justify-between items-center mt-5">
        <label className="text-sm font-medium w-30">Thickness</label>
        <ValueSlider
          onValueChange={(value) =>
            console.log("Brush size changed to:", value[0])
          }
          min={1}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
};

interface BrushTypeSelectorProps {
  selectedBrushType: "line" | "dashedLine" | "arrow" | "dashedArrow";
}

const BrushTypeSelector = ({ selectedBrushType }: BrushTypeSelectorProps) => {
  return (
    <div className="w-full mt-2 flex justify-between items-center">
      <label className="text-sm font-medium w-30">Type</label>
      <div className="flex space-x-2">
        {/* Line */}
        <button>
          <svg
            width={25}
            height={25}
            className={`rounded-md transition-all duration-200 cursor-pointer ${
              selectedBrushType === "line"
                ? "bg-accent-active"
                : "bg-accent hover:bg-accent-hover"
            }`}
          >
            <line
              x1="6"
              y1="19"
              x2="19"
              y2="6"
              stroke={
                selectedBrushType === "line"
                  ? "var(--color-background-secondary)"
                  : "white"
              }
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* Dashed Line */}
        <button>
          <svg
            width={25}
            height={25}
            className={`rounded-md transition-all duration-200 cursor-pointer ${
              selectedBrushType !== "dashedLine"
                ? "bg-accent hover:bg-accent-hover"
                : "bg-accent-active"
            }`}
          >
            <line
              x1="6"
              y1="19"
              x2="19"
              y2="6"
              stroke={
                selectedBrushType === "dashedLine"
                  ? "var(--color-background-secondary)"
                  : "white"
              }
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="3.5"
            />
          </svg>
        </button>
        {/* Arrow */}
        <button>
          <svg
            width={25}
            height={25}
            className={`rounded-md transition-all duration-200 cursor-pointer ${
              selectedBrushType !== "arrow"
                ? "bg-accent hover:bg-accent-hover"
                : "bg-accent-active"
            }`}
          >
            <line
              x1="6"
              y1="19"
              x2="19"
              y2="6"
              stroke={
                selectedBrushType === "arrow"
                  ? "var(--color-background-secondary)"
                  : "white"
              }
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="6"
              x2="10"
              y2="6"
              stroke={
                selectedBrushType === "arrow"
                  ? "var(--color-background-secondary)"
                  : "white"
              }
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="6"
              x2="19"
              y2="15"
              stroke={
                selectedBrushType === "arrow"
                  ? "var(--color-background-secondary)"
                  : "white"
              }
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* Dashed Arrow */}
        <button>
          <svg
            width={25}
            height={25}
            className={`rounded-md transition-all duration-200 cursor-pointer ${
              selectedBrushType !== "dashedArrow"
                ? "bg-accent hover:bg-accent-hover"
                : "bg-accent-active"
            }`}
          >
            <line
              x1="6"
              y1="19"
              x2="19"
              y2="6"
              stroke={
                selectedBrushType === "dashedArrow"
                  ? "var(--color-background-secondary)"
                  : "white"
              }
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="3.5"
            />
            <line
              x1="19"
              y1="6"
              x2="10"
              y2="6"
              stroke={
                selectedBrushType === "dashedArrow"
                  ? "var(--color-background-secondary)"
                  : "white"
              }
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="6"
              x2="19"
              y2="15"
              stroke={
                selectedBrushType === "dashedArrow"
                  ? "var(--color-background-secondary)"
                  : "white"
              }
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PenTool;
