export enum StreamingAvatarSessionState {
  INACTIVE = "inactive",
  CONNECTING = "connecting",
  CONNECTED = "connected",
}

export enum MessageSender {
  CLIENT = "client",
  AVATAR = "avatar",
}

export enum ProcessType {
  QUESTION = "question",
  REASONING = "reasoning",
  ANSWER = "answer",
}

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
}


export interface ProcessEventMessage {
  id: string;
  type: ProcessType;
  content: string; // process detail, eg: consulting database...
}

