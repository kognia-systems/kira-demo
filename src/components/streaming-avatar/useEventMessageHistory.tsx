import { useStreamingAvatarContext } from "./streamingAvatarContext";

export const useEventMessageHistory = () => {
  const { eventMessages } = useStreamingAvatarContext();
  return { eventMessages };
};
