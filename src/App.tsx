import { useEffect, useState } from "react";
import MapCanvas from "./components/canvas/MapCanvas";
import { type Map, mapsInfo } from "@/lib/mapInfo";
import HeroBar from "@/components/heroBar/HeroBar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useStageContext } from "./providers/AppProvider";

function App() {
  const { setInitialStageSettings, clearElements } = useStageContext();

  const [currentMap, setCurrentMap] = useState<Map>(mapsInfo[0]);

  useEffect(() => {
    setInitialStageSettings(currentMap);
    clearElements();
  }, [currentMap]);

  return (
    <div className="w-screen h-screen flex flex-col text-text">
      {/* Top Content */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Sidebar */}
        <Sidebar selectedMap={currentMap} onSelectMap={setCurrentMap} />
        {/* Map Canvas */}
        <MapCanvas map={currentMap} />
      </div>
      {/* Hero Bar */}
      <div className="h-25 bg-background border-t border-border">
        <HeroBar />
      </div>
    </div>
  );
}

export default App;
