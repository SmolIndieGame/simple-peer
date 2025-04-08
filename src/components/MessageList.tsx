import React, { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/ComponentTypes";

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="space-y-3 px-2 overflow-y-auto max-h-full"
    >
      {messages.length === 0 && (
        <div className="text-center py-8 text-light/50">
          <p>No messages yet</p>
          <p className="text-xs mt-1">
            Messages will appear here when you start chatting
          </p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`
              relative max-w-[80%] rounded-lg px-4 py-2 animate-fade-in
              ${
                message.isSent
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-dark border border-light/10 rounded-bl-none"
              }
            `}
          >
            {/* Progress bar */}
            {typeof message.progress === "number" && message.progress < 1 && (
              <div className="absolute top-0 left-0 h-1 w-full bg-light/20 rounded-t-lg overflow-hidden">
                <div
                  className={`h-full ${
                    message.isSent ? "bg-white" : "bg-green-400"
                  }`}
                  style={{ width: `${message.progress * 100}%` }}
                ></div>
              </div>
            )}

            {message.text && <div className="text-sm">{message.text}</div>}
            <div className="text-sm text-light">
              <a
                href={message.fileUrl || undefined}
                download={message.filename}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${
                  message.fileUrl
                    ? message.isSent
                      ? "text-white hover:text-dark"
                      : "text-white hover:text-primary"
                    : "cursor-not-allowed pointer-events-none"
                }`}
              >
                {message.filename}
              </a>
              {message.fileId && !message.isComplete ? " (Sending)" : ""}
            </div>
            <div
              className={`
                text-xs mt-1 text-right
                ${message.isSent ? "text-white/70" : "text-light/70"}
              `}
            >
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
