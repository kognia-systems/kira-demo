import { TaskType, TaskMode } from "@heygen/streaming-avatar";
import React, { useCallback, useEffect, useState } from "react";
import { usePrevious } from "ahooks";


import { useTextChat } from "../streaming-avatar/useTextChat";
import { useConversationState } from "../streaming-avatar/useConversationState";
import { Input } from "./input";
import { Button } from "./button";
import { SendIcon } from "lucide-react";
import { Select } from "@radix-ui/react-select";

export const TextInput: React.FC = () => {
  const { sendMessage, sendMessageSync, repeatMessage, repeatMessageSync } =
    useTextChat();
  const { startListening, stopListening } = useConversationState();
  const [taskType, setTaskType] = useState<TaskType>(TaskType.TALK);
  const [taskMode, setTaskMode] = useState<TaskMode>(TaskMode.ASYNC);
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    if (message.trim() === "") {
      return;
    }
    if (taskType === TaskType.TALK) {
      taskMode === TaskMode.SYNC
        ? sendMessageSync(message)
        : sendMessage(message);
    } else {
      taskMode === TaskMode.SYNC
        ? repeatMessageSync(message)
        : repeatMessage(message);
    }
    setMessage("");
  }, [
    taskType,
    taskMode,
    message,
    sendMessage,
    sendMessageSync,
    repeatMessage,
    repeatMessageSync,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSend();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSend]);

  const previousText = usePrevious(message);

  useEffect(() => {
    if (!previousText && message) {
      startListening();
    } else if (previousText && !message) {
      stopListening();
    }
  }, [message, previousText, startListening, stopListening]);

  return (
    <div className="flex flex-row gap-2 items-end w-full">
      {/* <Select
        isSelected={(option) => option === taskType}
        options={[TaskType.TALK, TaskType.REPEAT]}
        renderOption={(option) => option.toUpperCase()}
        value={taskType.toUpperCase()}
        onSelect={setTaskType}
      />
      <Select
        isSelected={(option) => option === taskMode}
        options={[TaskMode.SYNC, TaskMode.SYNC]}
        renderOption={(option) => option.toUpperCase()}
        value={taskMode.toUpperCase()}
        onSelect={setTaskMode}
      /> */}
      <Input
        className="min-w-[500px]"
        placeholder={`Escriber algo para ${
          taskType === TaskType.REPEAT ? "repetir" : "responder"
        }...`}
        value={message}
        onChange={(ev) => setMessage(ev.target.value)}
      />
      <Button className="!p-2" onClick={handleSend}>
        <SendIcon />
      </Button>
    </div>
  );
};
