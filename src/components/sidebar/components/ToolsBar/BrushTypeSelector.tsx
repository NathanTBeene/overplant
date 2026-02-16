interface BrushTypeSelectorProps {
  selectedBrushType: BrushType;
  onSelectBrushType: (type: BrushType) => void;
  allowArrows?: boolean;
}

export type BrushType = "line" | "dashedLine" | "arrow" | "dashedArrow";

const BrushTypeSelector = ({ selectedBrushType, onSelectBrushType, allowArrows = true }: BrushTypeSelectorProps) => {
  return (
    <div className="w-full mt-2 flex justify-between items-center">
      <label className="text-sm font-medium w-30">Type</label>
      <div className="flex space-x-2">
        {/* Line */}
        <button
          onClick={() => onSelectBrushType("line")}
        >
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
        <button
          onClick={() => onSelectBrushType("dashedLine")}
        >
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
        {allowArrows &&
          <button
            onClick={() => onSelectBrushType("arrow")}
          >
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
        }
        {/* Dashed Arrow */}
        { allowArrows &&
          <button
            onClick={() => onSelectBrushType("dashedArrow")}
          >
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
        }
      </div>
    </div>
  );
};
export default BrushTypeSelector;
