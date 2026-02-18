import { useCallback, useRef } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useSequenceAnimation } from "./useSequenceAnimation";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const useSequencePlayback = () => {
  const { switchSequence } = useSequenceAnimation();
  const stoppedRef = useRef(false);

  const play = useCallback(async () => {
    const { activeSequenceIndex, settings } = useAppStore.getState();
    stoppedRef.current = false;
    useAppStore.getState().setIsPlaying(true);

    for (let i = activeSequenceIndex + 1; i <= 9; i++) {
      if (stoppedRef.current) break;
      await switchSequence(i);
      if (stoppedRef.current) break;
      await sleep(settings.sequenceHoldTime);
    }

    stoppedRef.current = false;
    useAppStore.getState().setIsPlaying(false);
  }, [switchSequence]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    useAppStore.getState().setIsPlaying(false);
  }, []);

  return { play, stop };
};
