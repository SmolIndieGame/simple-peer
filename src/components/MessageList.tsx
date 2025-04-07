import React from "react";

interface ChatMessage {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: Date;
}

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-3 px-2">
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
              max-w-[80%] rounded-lg px-4 py-2 animate-fade-in
              ${
                message.isSent
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-dark border border-light/10 rounded-bl-none"
              }
            `}
          >
            <div className="text-sm">{message.text}</div>
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
