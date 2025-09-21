import { useStreamingAvatarContext } from "./streamingAvatarContext";
import { useCallback } from "react";


export const useInterrupt = () => {
  const { avatarRef } = useStreamingAvatarContext();

  const interrupt = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current.interrupt();
  }, [avatarRef]);

  return { interrupt };
};
