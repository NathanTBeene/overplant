/// <reference types="vite-plugin-svgr/client" />
import { getRoleHeroes } from "@/lib/heroInfo";
import HeroPortrait from "@/components/heroBar/components/HeroPortrait";
import DamageIcon from "@/assets/icons/damage_icon.svg?react";
import TankIcon from "@/assets/icons/tank_icon.svg?react";
import SupportIcon from "@/assets/icons/support_icon.svg?react";
import { useState } from "react";
import HeroBarSwitch from "./components/HeroBarSwitch";

const HeroBar = () => {
  const [isAlly, setIsAlly] = useState(true);

  const tankHeroes = getRoleHeroes("Tank");
  const damageHeroes = getRoleHeroes("Damage");
  const supportHeroes = getRoleHeroes("Support");

  return (
    <div className="h-full flex flex-row items-center gap-2 py-2">
      <HeroBarSwitch isAlly={isAlly} onToggle={setIsAlly} />

      {/* Tank */}
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

      {/* Damage */}
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

      {/* Support */}
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
    </div>
  );
};

export default HeroBar;
