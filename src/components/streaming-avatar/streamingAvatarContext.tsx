import React, { useRef, useState } from "react";

import StreamingAvatar, {
  ConnectionQuality,
  StreamingTalkingMessageEvent,
  UserTalkingMessageEvent,
} from "@heygen/streaming-avatar";
import {
  StreamingAvatarSessionState,
  Message,
  MessageSender,
  ProcessEventMessage,
  ProcessType,
} from "./interfaces";

type StreamingAvatarContextProps = {
  avatarRef: React.RefObject<StreamingAvatar | null>;
  basePath?: string;

  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  isVoiceChatLoading: boolean;
  setIsVoiceChatLoading: (isVoiceChatLoading: boolean) => void;
  isVoiceChatActive: boolean;
  setIsVoiceChatActive: (isVoiceChatActive: boolean) => void;

  sessionState: StreamingAvatarSessionState;
  setSessionState: (sessionState: StreamingAvatarSessionState) => void;
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;

  messages: Message[];
  appendMessage: (sender: MessageSender, content: string) => void;
  clearMessages: () => void;

  handleUserTalkingMessage: ({
    detail,
  }: {
    detail: UserTalkingMessageEvent;
  }) => void;
  handleStreamingTalkingMessage: ({
    detail,
  }: {
    detail: StreamingTalkingMessageEvent;
  }) => void;
  handleEndMessage: () => void;

  // Lista para mensajes de eventos del backend
  eventMessages: ProcessEventMessage[];
  appendEventMessage: (type: ProcessType, content: string) => void;
  clearEventMessages: () => void;
  handleReasoningMessage: ({ event }: { event: ProcessType }) => void;

  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isUserTalking: boolean;
  setIsUserTalking: (isUserTalking: boolean) => void;
  isAvatarTalking: boolean;
  setIsAvatarTalking: (isAvatarTalking: boolean) => void;

  connectionQuality: ConnectionQuality;
  setConnectionQuality: (connectionQuality: ConnectionQuality) => void;
};

const StreamingAvatarContext = React.createContext<StreamingAvatarContextProps>(
  {
    // Referencia al avatar
    avatarRef: { current: null },

    // Estado del mic
    isMuted: true,
    setIsMuted: () => {},

    // Inicia El Chat de voz
    isVoiceChatLoading: false,
    setIsVoiceChatLoading: () => {},

    // Estado Chat de voz
    isVoiceChatActive: false,
    setIsVoiceChatActive: () => {},

    // Estado de la session
    sessionState: StreamingAvatarSessionState.INACTIVE,
    setSessionState: () => {},

    // Media Stream (video)
    stream: null,
    setStream: () => {},

    // Handle Chat Event message
    messages: [],
    appendMessage: () => {},
    clearMessages: () => {},

    // Handle Process Event message
    eventMessages: [],
    appendEventMessage: () => {},
    clearEventMessages: () => {},
    handleReasoningMessage: () => {},

    // Handle Streaming Activity
    handleUserTalkingMessage: () => {},
    handleStreamingTalkingMessage: () => {},
    handleEndMessage: () => {},

    // Handle Listening
    isListening: false,
    setIsListening: () => {},

    // User talking flag
    isUserTalking: false,
    setIsUserTalking: () => {},

    // Avatar talking flag
    isAvatarTalking: false,
    setIsAvatarTalking: () => {},

    // Connection Quality
    connectionQuality: ConnectionQuality.UNKNOWN,
    setConnectionQuality: () => {},
  }
);

// Hooks Personalizados
const useStreamingAvatarSessionState = () => {
  const [sessionState, setSessionState] = useState(
    StreamingAvatarSessionState.INACTIVE
  );
  const [stream, setStream] = useState<MediaStream | null>(null);

  return {
    sessionState,
    setSessionState,
    stream,
    setStream,
  };
};

const useStreamingAvatarVoiceChatState = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVoiceChatLoading, setIsVoiceChatLoading] = useState(false);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);

  return {
    isMuted,
    setIsMuted,
    isVoiceChatLoading,
    setIsVoiceChatLoading,
    isVoiceChatActive,
    setIsVoiceChatActive,
  };
};

const useStreamingAvatarMessageState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const currentSenderRef = useRef<MessageSender | null>(null);

  const handleUserTalkingMessage = ({
    detail,
  }: {
    detail: UserTalkingMessageEvent;
  }) => {
    // Prevent empty messages
    if (!detail.message || detail.message.trim() === "") {
      return;
    }

    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];

      // Check if message already exists (deduplication)
      const messageExists = prev.some(
        (msg) =>
          msg.content === detail.message && msg.sender === MessageSender.CLIENT
      );

      if (messageExists) {
        return prev; // No agregar duplicado
      }

      // If last message is from CLIENT and content is different, append to it
      if (
        lastMessage &&
        lastMessage.sender === MessageSender.CLIENT &&
        !lastMessage.content.includes(detail.message)
      ) {
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            content: lastMessage.content + detail.message,
          },
        ];
      }

      // Otherwise, create new message with unique ID
      currentSenderRef.current = MessageSender.CLIENT;
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sender: MessageSender.CLIENT,
          content: detail.message,
        },
      ];
    });
  };

  const handleStreamingTalkingMessage = ({
    detail,
  }: {
    detail: StreamingTalkingMessageEvent;
  }) => {
    if (currentSenderRef.current === MessageSender.AVATAR) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          ...prev[prev.length - 1],
          content: [prev[prev.length - 1].content, detail.message].join(""),
        },
      ]);
    } else {
      currentSenderRef.current = MessageSender.AVATAR;
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sender: MessageSender.AVATAR,
          content: detail.message,
        },
      ]);
    }
  };

  const handleEndMessage = () => {
    currentSenderRef.current = null;
  };

  return {
    messages,
    appendMessage: (sender: MessageSender, content: string) => {
      const newMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender,
        content,
      };

      setMessages((prev) => {
        const messageExists = prev.some(
          (msg) => msg.content === content && msg.sender === sender
        );

        if (messageExists) {
          return prev; // No agregar duplicado
        }

        return [...prev, newMessage];
      });

      // Avoid merging with ongoing streaming chunks
      currentSenderRef.current = null;
    },
    clearMessages: () => {
      setMessages([]);
      currentSenderRef.current = null;
    },
    handleUserTalkingMessage,
    handleStreamingTalkingMessage,
    handleEndMessage,
  };
};

const useStreamingAvatarListeningState = () => {
  const [isListening, setIsListening] = useState(false);

  return { isListening, setIsListening };
};

const useStreamingAvatarTalkingState = () => {
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);

  return {
    isUserTalking,
    setIsUserTalking,
    isAvatarTalking,
    setIsAvatarTalking,
  };
};

const useStreamingAvatarConnectionQualityState = () => {
  const [connectionQuality, setConnectionQuality] = useState(
    ConnectionQuality.UNKNOWN
  );

  return { connectionQuality, setConnectionQuality };
};

// Nuevo: reasoning message state hook
const useReasoningMessageState = () => {
  const [eventMessages, setEventMessages] = useState<ProcessEventMessage[]>([]);

  const handleReasoningMessage = () => {
    setEventMessages((prev) => {
      const lastMessage = prev[prev.length - 1];

      // create new message with unique ID
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: lastMessage.type,
          content: lastMessage.content,
        },
      ];
    });
  };

  return {
    eventMessages,
    appendEventMessage: (type: ProcessType, content: string) => {
      const newMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        content,
      };

      setEventMessages((prev) => {
        return [...prev, newMessage];
      });
    },
    clearEventMessages: () => {
      setEventMessages([]);
    },
    handleReasoningMessage,
  };
};

export const StreamingAvatarProvider = ({
  children,
  basePath,
}: {
  children: React.ReactNode;
  basePath?: string;
}) => {
  const avatarRef = React.useRef<StreamingAvatar>(null);
  const voiceChatState = useStreamingAvatarVoiceChatState();
  const sessionState = useStreamingAvatarSessionState();
  const messageState = useStreamingAvatarMessageState();
  const listeningState = useStreamingAvatarListeningState();
  const talkingState = useStreamingAvatarTalkingState();
  const connectionQualityState = useStreamingAvatarConnectionQualityState();
  const reasoningMessageState = useReasoningMessageState();

  return (
    <StreamingAvatarContext.Provider
      value={{
        avatarRef,
        basePath,
        ...voiceChatState,
        ...sessionState,
        ...messageState,
        ...listeningState,
        ...talkingState,
        ...connectionQualityState,
        ...reasoningMessageState,
      }}
    >
      {children}
    </StreamingAvatarContext.Provider>
  );
};

export const useStreamingAvatarContext = () => {
  return React.useContext(StreamingAvatarContext);
};
