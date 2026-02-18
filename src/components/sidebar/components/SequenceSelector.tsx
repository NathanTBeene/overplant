import SidebarHeader from "./SidebarHeader";
import { ChevronLeft, ChevronRight, Play, Square } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useSequenceAnimation } from "@/hooks/useSequenceAnimation";
import { useSequencePlayback } from "@/hooks/useSequencePlayback";
import Tooltip from "@/components/ui/Tooltip";

const SequenceSelector = () => {
  const sequences = useAppStore((s) => s.sequences);
  const activeIndex = useAppStore((s) => s.activeSequenceIndex);
  const isAnimating = useAppStore((s) => s.isAnimating);
  const isPlaying = useAppStore((s) => s.isPlaying);
  const { switchSequence } = useSequenceAnimation();
  const { play, stop } = useSequencePlayback();

  const disabled = isAnimating || isPlaying;

  return (
    <div className="flex flex-col space-y-2">
      <SidebarHeader title="Sequence" tooltip="Select a sequence step" />
      <div className="grid grid-cols-5 gap-2">
        {sequences.map((seq, i) => (
          <Tooltip
            key={i}
            content={
              seq.thumbnail ? (
                <img src={seq.thumbnail} className="w-48 rounded" alt={`Sequence ${i + 1} preview`} />
              ) : (
                <div className="text-xs text-gray-400 p-1">No preview yet</div>
              )
            }
            properties={{ side: "right", delay: 300 }}
          >
            <SequenceButton
              number={i + 1}
              selected={i === activeIndex}
              disabled={disabled}
              onClick={() => switchSequence(i)}
            />
          </Tooltip>
        ))}
      </div>

      {/* Sequence Play Controls */}
      <div className="flex justify-center items-center gap-10">
        <SequenceButton
          icon={<ChevronLeft size={28} />}
          disabled={disabled || activeIndex === 0}
          onClick={() => switchSequence(activeIndex - 1)}
        />
        <SequencePlayButton onClick={isPlaying ? stop : play} isPlaying={isPlaying} />
        <SequenceButton
          icon={<ChevronRight size={28} />}
          disabled={disabled || activeIndex === 9}
          onClick={() => switchSequence(activeIndex + 1)}
        />
      </div>
    </div>
  );
};

const SequenceButton = ({
  number,
  selected = false,
  icon = null,
  onClick,
  disabled = false,
}: {
  number?: number;
  selected?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  if (!number && !icon) return null;

  return (
    <button
      disabled={disabled}
      className={`hover:bg-fill-dark transition-colors duration-200 rounded-sm h-10 flex items-center justify-center text-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        selected ? "bg-accent! hover:bg-accent-hover!" : ""
      } ${!number ? "w-10" : "w-full"}`}
      onClick={onClick}
    >
      {number || icon}
    </button>
  );
};

const SequencePlayButton = ({
  onClick,
  isPlaying,
}: {
  onClick: () => void;
  isPlaying: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`h-10 w-10 p-1 flex items-center justify-center hover:bg-fill-dark rounded-md shadow-sm hover:cursor-pointer transition-all duration-200
        ${isPlaying ? "bg-cancel hover:bg-cancel-hover" : "bg-confirm/50! hover:bg-confirm-hover/80!"}`}
    >
      {isPlaying ? <Square size={20} /> : <Play size={20} />}
    </button>
  );
};

export default SequenceSelector;
