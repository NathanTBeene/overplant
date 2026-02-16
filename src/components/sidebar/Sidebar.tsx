import MapSelect from "./components/MapSelect";
import SequenceSelector from "./components/SequenceSelector";
import DeleteSection from "./components/DeleteSection";
import ToolsBar, { type ToolType } from "./components/ToolsBar";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import type { Map } from "@/lib/mapInfo";
import { useStageContext } from "@/providers/AppProvider";

interface SidebarProps {
  selectedMap: Map;
  onSelectMap: (map: Map) => void;
}

const Sidebar = ({ selectedMap, onSelectMap }: SidebarProps) => {

  const {activeTool, setActiveTool} = useStageContext();


  const handleSelectTool = (tool: ToolType) => {
    console.log("Selected tool from Sidebar:", tool);
    setActiveTool(tool);
  }

  const handleDeselectTool = () => {
    console.log("Deselected tool from Sidebar");
    setActiveTool("none");
  }

  return (
    <ScrollArea.Root className="bg-background-secondary w-75 flex flex-col border-r border-border gap-8 h-full">
      <ScrollArea.Viewport className="flex-1 pt-4 pb-4">
        <div className="px-4 flex flex-col gap-8">
          <MapSelect selectedMap={selectedMap} onSelectMap={onSelectMap} />
          <SequenceSelector />
          <DeleteSection />
          <ToolsBar selectedTool={activeTool} onSelectTool={handleSelectTool} onDeselectTool={handleDeselectTool} />
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical"/>
    </ScrollArea.Root>
  );
};

export default Sidebar;
