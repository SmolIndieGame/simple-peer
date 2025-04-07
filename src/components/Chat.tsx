import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { DataConnection } from "peerjs";
import { PeerMessage } from "../types/PeerMessage";

interface ChatProps {
  conn: DataConnection;
  peerId: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: Date;
}

const Chat: React.FC<ChatProps> = ({ conn }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(conn?.open ?? false);

  useEffect(() => {
    if (conn) {
      const handleData = (data: unknown) => {
        const message = data as PeerMessage;
        if (!message || message.type !== "textMessage") return;

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `msg-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            text: message.message,
            isSent: false,
            timestamp: new Date(),
          },
        ]);
      };

      const handleOpen = () => {
        setIsConnected(true);
      };

      const handleClose = () => {
        setIsConnected(false);
      };

      conn.on("data", handleData);
      conn.on("open", handleOpen);
      conn.on("close", handleClose);

      return () => {
        conn.off("data", handleData);
        conn.off("open", handleOpen);
        conn.off("close", handleClose);
      };
    }
  }, [conn]);

  const handleSendMessage = (message: string) => {
    if (isConnected && conn) {
      conn.send({ type: "textMessage", message } satisfies PeerMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          text: message,
          isSent: true,
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList messages={messages} />
      </div>
      {isConnected ? (
        <div className="bg-dark/80 backdrop-blur-sm pt-2">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      ) : (
        <div className="p-4 text-center text-red-400 border border-red-500/30 rounded-md">
          <div className="flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Connection Lost
          </div>
          <p className="text-sm">
            The peer has disconnected. Please try reconnecting.
          </p>
        </div>
      )}
    </div>
  );
};

export default Chat;
