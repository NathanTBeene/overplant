import MapSelect from "./components/MapSelect";
import SequenceSelector from "./components/SequenceSelector";
import DeleteSection from "./components/DeleteSection";
import ToolsBar from "./components/ToolsBar";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface SidebarProps {
  selectedMap: any;
  onSelectMap: (map: any) => void;
}

const Sidebar = ({ selectedMap, onSelectMap }: SidebarProps) => {
  return (
    <ScrollArea.Root className="bg-background-secondary w-75 flex flex-col border-r border-border gap-8">
      <ScrollArea.Viewport className="flex-1 pt-4 overflow-visible">
        <div className="px-4 flex flex-col gap-8">
          <MapSelect selectedMap={selectedMap} onSelectMap={onSelectMap} />
          <SequenceSelector />
          <DeleteSection />
          <ToolsBar />
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" />
    </ScrollArea.Root>
  );
};

export default Sidebar;
