/// <reference types="vite-plugin-svgr/client" />
import { getRoleHeroes } from "@/lib/heroInfo";
import HeroPortrait from "@/components/heroBar/components/HeroPortrait";
import DamageIcon from "@/assets/icons/damage_icon.svg?react";
import TankIcon from "@/assets/icons/tank_icon.svg?react";
import SupportIcon from "@/assets/icons/support_icon.svg?react";
import { useRef, useState } from "react";
import HeroBarSwitch from "./components/HeroBarSwitch";
import * as ScrollArea from "@radix-ui/react-scroll-area";

const HeroBar = () => {
  const [isAlly, setIsAlly] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: React.WheelEvent) => {
    if (viewportRef.current) {
      event.preventDefault();
      viewportRef.current.scrollLeft += event.deltaY;
    }
  };

  return (
    <div className="w-full h-full flex items-center">
      <div className="shrink-0">
        <HeroBarSwitch isAlly={isAlly} onToggle={setIsAlly} />
      </div>

      <ScrollArea.Root className="w-full h-full flex items-center">
        <ScrollArea.Viewport
          onWheel={handleWheel}
          ref={viewportRef}
          className="flex-1 overflow-visible"
        >
          <div className="px-4 flex flex-row gap-2 pr-100">
            <HeroList isAlly={isAlly} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
      </ScrollArea.Root>
    </div>
  );
};

interface HeroListProps {
  isAlly: boolean;
}

const HeroList = ({ isAlly }: HeroListProps) => {
  const tankHeroes = getRoleHeroes("Tank");
  const damageHeroes = getRoleHeroes("Damage");
  const supportHeroes = getRoleHeroes("Support");
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <TankIcon
          className={`h-11 w-11 mx-4 ${
            isAlly ? "fill-overwatch-ally" : "fill-overwatch-enemy"
          }`}
        />
        <span
          className={`font-bold uppercase text-xs ${
            isAlly ? "text-overwatch-ally" : "text-overwatch-enemy"
          }`}
        >
          Tank
        </span>
      </div>
      {tankHeroes.map((hero) => (
        <HeroPortrait key={hero.id} hero={hero} isAlly={isAlly} />
      ))}
      <div className="flex flex-col items-center justify-center gap-2">
        <DamageIcon
          className={`h-11 w-11 mx-4 ${
            isAlly ? "fill-overwatch-ally" : "fill-overwatch-enemy"
          }`}
        />
        <span
          className={`font-bold uppercase text-xs ${
            isAlly ? "text-overwatch-ally" : "text-overwatch-enemy"
          }`}
        >
          Damage
        </span>
      </div>
      {damageHeroes.map((hero) => (
        <HeroPortrait key={hero.id} hero={hero} isAlly={isAlly} />
      ))}
      <div className="flex flex-col items-center justify-center gap-2">
        <SupportIcon
          className={`h-11 w-11 mx-4 ${
            isAlly ? "fill-overwatch-ally" : "fill-overwatch-enemy"
          }`}
        />
        <span
          className={`font-bold uppercase text-xs ${
            isAlly ? "text-overwatch-ally" : "text-overwatch-enemy"
          }`}
        >
          Support
        </span>
      </div>
      {supportHeroes.map((hero) => (
        <HeroPortrait key={hero.id} hero={hero} isAlly={isAlly} />
      ))}
    </>
  );
};

export default HeroBar;
