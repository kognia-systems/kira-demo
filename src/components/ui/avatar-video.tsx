"use client";

import React, { forwardRef } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";
import { Loader, Wifi, WifiOff } from "lucide-react";
import { StreamingAvatarSessionState } from "../streaming-avatar/interfaces";
import { useStreamingAvatarContext } from "../streaming-avatar/streamingAvatarContext";
import { Badge } from "./badge";

export const AvatarVideo = forwardRef<HTMLVideoElement>(({}, ref) => {
  const { sessionState, connectionQuality } = useStreamingAvatarContext();

  const isLoaded = sessionState === StreamingAvatarSessionState.CONNECTED;
  const isConnecting = sessionState === StreamingAvatarSessionState.CONNECTING;

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case ConnectionQuality.GOOD:
        return <Wifi className="w-4 h-4 text-green-500" />;
      case ConnectionQuality.BAD:
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionQuality) {
      case ConnectionQuality.GOOD:
        return "Good";
      case ConnectionQuality.BAD:
        return "Poor";
      default:
        return "Connecting";
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-lg">
      {/* Pantalla del teléfono - Aquí irá el video */}
      <video
        ref={ref}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <track kind="captions" />
      </video>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
          {isConnecting ? (
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 text-gray-600 animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Conectando con Kira
                </h3>
                <p className="text-white/60 text-sm">
                  Por favor espere mientras se establece conexión...
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="w-24 h-24  flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Listo para conexión
              </h3>
              <p className="text-white">
                Inicia la llamada para iniciar una sesión
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

AvatarVideo.displayName = "AvatarVideo";
