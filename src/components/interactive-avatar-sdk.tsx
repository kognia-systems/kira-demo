import { useEffect, useRef } from "react";

import { useMemoizedFn, useUnmount } from "ahooks";

import { AvatarVideo } from "./ui/avatar-video";
import { VideoStreamControls } from "./ui/video-stream-controls";
import { StartAvatarRequest, StreamingEvents } from "@heygen/streaming-avatar";
import { useStreamingAvatarSession } from "./streaming-avatar/useStreamingAvatarSession";
import { useVoiceChat } from "./streaming-avatar/useVoiceChat";

export const InteractiveAvatarSDK = ({
  config,
}: {
  config: StartAvatarRequest;
}) => {
  const mediaStream = useRef<HTMLVideoElement>(null);

  const { initAvatar, startAvatar, stopAvatar, stream } =
    useStreamingAvatarSession();

  const { startVoiceChat } = useVoiceChat();

  // Get session Token
  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  const startSession = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      await startAvatar(config);

      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  const handleStopSession = useMemoizedFn(async () => {
    try {
      await stopAvatar();
    } catch (error) {
      console.error("Error stopping avatar session:", error);
    }
  });

  useUnmount(() => {
    handleStopSession();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="h-full bg-dark rounded-[40px] overflow-hidden relative">
      {/* Avatar video */}
      <AvatarVideo ref={mediaStream} />

      {/* Video Controls */}
      <VideoStreamControls
        onStart={() => startSession(true)}
        onStop={handleStopSession}
      />

      {/* Notch o cámara frontal simulada */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-30 h-8 bg-dark rounded-2xl z-20"></div>
    </div>
  );
};
