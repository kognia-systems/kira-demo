import { useStreamingAvatarContext } from "./streamingAvatarContext";

export const useMessageHistory = () => {
  const { messages } = useStreamingAvatarContext();
  return { messages };
};
