import { mapsInfo, type Map } from "@/lib/mapInfo";
import { useAppStore } from "@/stores/useAppStore";
import { RotateCw, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

interface MapSelectProps {
  selectedMap: Map;
  onSelectMap: (map: Map) => void;
}

const MapSelect = ({ selectedMap, onSelectMap }: MapSelectProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mapSide = useAppStore((s) => s.mapSide);
  const toggleMapSide = useAppStore((s) => s.toggleMapSide);

  const handleMapSelect = (map: Map) => {
    setIsExpanded(false);
    onSelectMap(map);
  };

  const handleSwapSide = () => {
    toggleMapSide();
  };

  const mapImage = (mapInfo: Map, onClick: () => void, className?: string) => {

    // split by space and put each word on a new line
    const formattedName = mapInfo.name
      .split("\n")
      .map((line, index) => (
        <span key={index}>
          {line}
        </span>
      ));

    return (
      <div
        className={`h-16 overflow-hidden rounded-sm relative hover:scale-102 transition-all duration-300 cursor-pointer ${className}`}
        onClick={onClick}
      >
        <h2 className="absolute inset-0 uppercase flex flex-col text-center flex-wrap items-center z-10 justify-center text-white font-bold pointer-events-none text-shadow-lg text-shadow-background/30">
          {formattedName}
        </h2>
        <img
          src={mapInfo.headerImage}
          alt={mapInfo.name}
          className="blur-[1px] hover:blur-none transition-all"
        />
      </div>
    );
  };

  const otherMaps = mapsInfo.filter((map) => map.id !== selectedMap.id);

  return (
    <div className="flex flex-col space-y-2">
      {/* Selected Map */}
      <div className="flex justify-center h-16 gap-2">
        {mapImage(
          selectedMap,
          () => setIsExpanded(!isExpanded),
          "text-xl flex-1"
        )}
        <MapButton
          map={selectedMap}
          side={mapSide}
          onSwapSide={handleSwapSide}
        />
      </div>

      {/* Other Maps */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "opacity-100 max-h-150" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-2 p-1 max-h-148 overflow-y-auto scrollbar-none pr-2">
          {otherMaps.map((map, index) => (
            <div
              key={map.id}
              className={`transform transition-all duration-300 ease-in-out ${
                isExpanded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
              }}
            >
              {mapImage(map, () => handleMapSelect(map), "text-2xl")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MapButton = ({
  map,
  side,
  onSwapSide,
}: {
  map: Map;
  side: "Attack" | "Defense";
  onSwapSide: () => void;
}) => {
  const getMapIcon = () => {
    switch (map.type) {
      case "hybrid":
        return <ArrowLeftRight size={25} />;
      case "control":
        return <RotateCw size={25} />;
      case "assault":
        return <RotateCw size={25} />;
      case "escort":
        return <ArrowLeftRight size={25} />;
      default:
        return <RotateCw size={25} />;
    }
  };

  const getMapText = () => {
    switch (map.type) {
      case "hybrid":
        return side;
      case "control":
        return "Control";
      case "assault":
        return "Assault";
      case "escort":
        return "Escort";
      default:
        return "Map";
    }
  };

  return (
    <button
      onClick={onSwapSide}
      className="bg-fill hover:bg-fill-hover transition-all duration-200 cursor-pointer w-18 rounded-sm px-3 flex flex-col items-center justify-center text-sm gap-1 font-semibold"
    >
      <div
        className={`transition-all duration-300 ${
          side === "Attack"
            ? "text-overwatch-enemy"
            : "text-overwatch-ally rotate-180"
        }`}
      >
        {getMapIcon()}
      </div>
      <span className="">{getMapText()}</span>
    </button>
  );
};

export default MapSelect;
