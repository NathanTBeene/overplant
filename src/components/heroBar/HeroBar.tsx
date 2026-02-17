/// <reference types="vite-plugin-svgr/client" />
import { getRoleHeroes } from "@/lib/heroInfo";
import HeroPortrait from "@/components/heroBar/components/HeroPortrait";
import DamageIcon from "@/assets/icons/damage_icon.svg?react";
import TankIcon from "@/assets/icons/tank_icon.svg?react";
import SupportIcon from "@/assets/icons/support_icon.svg?react";
import { useState } from "react";
import HeroBarSwitch from "./components/HeroBarSwitch";
import Carousel from "../base/Carousel";

const HeroBar = () => {
  const [isAlly, setIsAlly] = useState(true);
  // const viewportRef = useRef<HTMLDivElement>(null);

  // const handleWheel = (event: React.WheelEvent) => {
  //   if (viewportRef.current) {
  //     event.preventDefault();
  //     viewportRef.current.scrollLeft += event.deltaY;
  //   }
  // };

  return (
    <div className="w-full h-full flex items-center">
      <div className="shrink-0">
        <HeroBarSwitch isAlly={isAlly} onToggle={setIsAlly} />
      </div>

      <div className="flex-1 h-full flex items-center gap-4">
        <RoleCarousel role="Tank" isAlly={isAlly} />
        <RoleCarousel role="Damage" isAlly={isAlly} />
        <RoleCarousel role="Support" isAlly={isAlly} />
      </div>
    </div>
  );
};

interface RoleCarouselProps {
  role: "Tank" | "Damage" | "Support";
  isAlly: boolean;
}

const RoleCarousel = ({ role, isAlly }: RoleCarouselProps) => {
  const heroes = getRoleHeroes(role);

  const getIcon = () => {
    switch (role) {
      case "Tank":
        return TankIcon;
      case "Damage":
        return DamageIcon;
      case "Support":
        return SupportIcon;
    }
  };

  const Icon = getIcon();

  const heroElements = heroes.map((hero) => (
    <HeroPortrait key={hero.id} hero={hero} isAlly={isAlly} />
  ));

  return (
    <div className="flex items-center gap-2">
      {/* Role Header */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Icon
          className={`h-11 w-11 mx-4 ${
            isAlly ? "fill-overwatch-ally" : "fill-overwatch-enemy"
          }`}
        />
        <span
          className={`font-bold uppercase text-xs ${
            isAlly ? "text-overwatch-ally" : "text-overwatch-enemy"
          }`}
        >
          {role}
        </span>
      </div>

      {/* Heroes Carousel */}
      <div className="w-full">
        <Carousel itemsPerView={4.5} className="w-full">
          {heroElements}
        </Carousel>
      </div>
    </div>
  );
};

export default HeroBar;
