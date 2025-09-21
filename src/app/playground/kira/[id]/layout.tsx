"use client";

import { StreamingAvatarProvider } from "@/components/streaming-avatar/streamingAvatarContext";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      {children}
    </StreamingAvatarProvider>
  );
}
