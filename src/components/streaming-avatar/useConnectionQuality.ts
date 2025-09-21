import { useStreamingAvatarContext } from "./streamingAvatarContext";

export const useConnectionQuality = () => {
  const { connectionQuality } = useStreamingAvatarContext();

  return {
    connectionQuality,
  };
};
