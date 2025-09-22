import React, { useEffect, useRef } from "react";
import { useMessageHistory } from "./streaming-avatar/useMessageHistory";
import { MessageSender } from "./streaming-avatar/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { User, BotMessageSquare } from "lucide-react";
import { TextInput } from "./ui/text-input";

export const MessageHistory: React.FC = () => {
  const { messages } = useMessageHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || messages.length === 0) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <motion.div
      className="bg-white dark:bg-card rounded-2xl border flex flex-col h-full max-h-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-3 border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold">
              Historial de conversación
            </h3>
          </div>
        </div>
      </div>

      {/* Chat content bubbles - Toma toda la altura disponible */}
      <div className="flex-1 min-h-0 p-2">
        <div className="h-full overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Esperando conversación
              </h4>
              <p className="text-gray-300 text-sm max-w-sm">
                Los mensajes de la conversación aparecerán aquí cuando inicie la
                interacción con el avatar.
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`flex gap-3 ${
                  message.sender === MessageSender.CLIENT
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.sender === MessageSender.CLIENT
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  {/* Avatar Bubble */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === MessageSender.CLIENT
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {message.sender === MessageSender.CLIENT ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <BotMessageSquare className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <motion.div
                    className={`px-4 py-2 rounded-lg ${
                      message.sender === MessageSender.CLIENT
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.1 }}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={containerRef} />
        </div>
      </div>

      {/* Text input - Solo se muestra cuando no hay mensajes */}
      {messages.length > 0 && (
        <motion.div
          className="m-4 pt-4 border-t flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TextInput />
        </motion.div>
      )}
    </motion.div>
  );
};
