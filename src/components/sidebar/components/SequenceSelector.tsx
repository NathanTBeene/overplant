import ComingSoon from "@/components/base/ComingSoon";
import SidebarHeader from "./SidebarHeader";

const SequenceSelector = () => {
  return (
    <div className="flex flex-col space-y-2">
      <SidebarHeader title="Sequence" tooltip="Select a sequence step" />
      {/* <div className="grid grid-cols-5 gap-2">
        <SequenceButton number={1} />
        <SequenceButton number={2} />
        <SequenceButton number={3} />
        <SequenceButton number={4} />
        <SequenceButton number={5} />
        <SequenceButton number={6} selected />
        <SequenceButton number={7} />
        <SequenceButton number={8} />
        <SequenceButton number={9} />
        <SequenceButton number={10} />
      </div> */}
      <ComingSoon>
        Sequence editor coming soon!
      </ComingSoon>
    </div>
  );
};

const SequenceButton = ({
  number,
  selected = false,
}: {
  number: number;
  selected?: boolean;
}) => {
  return (
    <button
      className={`hover:bg-slate-500 transition-colors rounded-sm h-10 flex items-center justify-center text-2xl cursor-pointer ${
        selected ? "bg-overwatch-orange" : ""
      }`}
    >
      {number}
    </button>
  );
};

export default SequenceSelector;
