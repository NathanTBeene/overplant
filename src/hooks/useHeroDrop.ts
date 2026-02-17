import type { DragEvent } from "react";
import type { HeroInfo } from "@/lib/heroInfo";
import type { MapElement } from "@/types/MapElement";
import { useAppStore } from "@/stores/useAppStore";
import { stageRef } from "@/stores/stageRef";

export const useHeroDrop = () => {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    try {
      const heroData = e.dataTransfer.getData("application/hero");
      const isAlly = e.dataTransfer.getData("application/isAlly") === "true";
      const hero: HeroInfo = JSON.parse(heroData);

      const mapSide = useAppStore.getState().mapSide;
      const imageSize = useAppStore.getState().mapImageSize;
      const stage = stageRef.current;
      if (!stage) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const canvasCoords = {
        x: (clientX - stage.x()) / stage.scaleX(),
        y: (clientY - stage.y()) / stage.scaleX(),
      };

      // If map is flipped, we need to flip the pointer coordinates as well
      if (mapSide === "Defense") {
        canvasCoords.x = imageSize.width - canvasCoords.x;
        canvasCoords.y = imageSize.height - canvasCoords.y;
      }

      const styles = getComputedStyle(document.documentElement);
      const backgroundColor = isAlly
        ? styles.getPropertyValue("--color-overwatch-ally")
        : styles.getPropertyValue("--color-overwatch-enemy");

      const heroElement: MapElement = {
        id: `hero-${hero.id}-${Math.random()}`,
        type: "image",
        x: canvasCoords.x - 40,
        y: canvasCoords.y - 40,
        src: hero.portrait,
        backgroundColor,
        width: 80,
        height: 80,
        draggable: true,
        borderRadius: 8,
      };

      useAppStore.getState().addElement(heroElement);
      useAppStore.getState().setActiveTool("none");
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
    }
  };

  return { handleDragOver, handleDrop };
};
