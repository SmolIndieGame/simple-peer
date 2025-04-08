import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { PeerMessage } from "../types/PeerMessage";
import type { ChatMessage } from "../types/ComponentTypes";
import { DataConnection, PeerError } from "peerjs";
import { toast } from "react-hot-toast";

export interface ChatProps {
  conn: DataConnection;
  peerId: string;
}

const CHUNK_SIZE = 1024 * 1024; // 1MB

const Chat: React.FC<ChatProps> = ({ conn }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(conn?.open ?? false);

  // Buffer for incoming file chunks
  const fileBuffers = React.useRef<
    Record<
      string,
      {
        chunks: ArrayBuffer[];
        received: number;
        totalSize: number;
        totalChunks: number;
        filename: string;
        filetype: string;
      }
    >
  >({});

  useEffect(() => {
    if (!conn) return;

    const handleData = (data: unknown) => {
      const message = data as PeerMessage;
      if (!message) return;

      if (message.type === "textMessage") {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            text: message.message,
            isSent: false,
            timestamp: new Date(),
          },
        ]);
      } else if (message.type === "file") {
        // Legacy full file transfer
        const blob = new Blob([message.data], { type: message.filetype });
        const url = URL.createObjectURL(blob);
        setMessages((prev) => [
          ...prev,
          {
            id: `file-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            fileUrl: url,
            filename: message.filename,
            isSent: false,
            timestamp: new Date(),
            progress: 1,
            isComplete: true,
          },
        ]);
      } else if (message.type === "fileChunk") {
        const {
          fileId,
          filename,
          filetype,
          totalSize,
          chunkIndex,
          totalChunks,
          data: chunkData,
        } = message;

        if (!fileBuffers.current[fileId]) {
          fileBuffers.current[fileId] = {
            chunks: [],
            received: 0,
            totalSize,
            totalChunks,
            filename,
            filetype,
          };

          // Create initial message with 0 progress
          setMessages((prev) => [
            ...prev,
            {
              id: fileId,
              filename,
              isSent: false,
              timestamp: new Date(),
              progress: 0,
              isComplete: false,
              fileId,
            },
          ]);
        }

        const buffer = fileBuffers.current[fileId];
        buffer.chunks[chunkIndex] = chunkData;
        buffer.received++;

        const progress = buffer.received / buffer.totalChunks;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.fileId === fileId
              ? { ...msg, progress, isComplete: progress === 1 }
              : msg
          )
        );

        if (buffer.received === buffer.totalChunks) {
          const blob = new Blob(buffer.chunks, { type: buffer.filetype });
          const url = URL.createObjectURL(blob);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.fileId === fileId
                ? { ...msg, fileUrl: url, progress: 1, isComplete: true }
                : msg
            )
          );

          delete fileBuffers.current[fileId];
        }
      }
    };

    const handleOpen = () => setIsConnected(true);
    const handleClose = () => setIsConnected(false);

    const handleError = (err: PeerError<string>) => {
      toast.error(`Peer Error: ${err.type}`);
      setIsConnected(false);
    };

    const handleStateChanged = (state: RTCIceConnectionState) => {
      if (state !== "disconnected") return;

      setIsConnected(false);
    };

    conn.on("data", handleData);
    conn.on("open", handleOpen);
    conn.on("close", handleClose);
    conn.on("error", handleError);
    conn.on("iceStateChanged", handleStateChanged);

    return () => {
      conn.off("data", handleData);
      conn.off("open", handleOpen);
      conn.off("close", handleClose);
      conn.off("error", handleError);
      conn.off("iceStateChanged", handleStateChanged);
    };
  }, [conn]);

  const handleSendMessage = (message: string) => {
    if (!isConnected || !conn) return;

    conn.send({ type: "textMessage", message } satisfies PeerMessage);

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        text: message,
        isSent: true,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendFile = async (file: File, data: ArrayBuffer) => {
    if (!isConnected || !conn) return;

    const totalSize = data.byteLength;
    const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
    const fileId = `file-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Add message with 0 progress
    setMessages((prev) => [
      ...prev,
      {
        id: fileId,
        filename: file.name,
        isSent: true,
        timestamp: new Date(),
        progress: 0,
        isComplete: false,
        fileId,
      },
    ]);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const chunkData = data.slice(start, end);

      const chunkMessage = {
        type: "fileChunk",
        fileId,
        filename: file.name,
        filetype: file.type,
        totalSize,
        chunkIndex: i,
        totalChunks,
        data: chunkData,
      } satisfies PeerMessage;

      await conn.send(chunkMessage);

      // Update progress after each chunk
      setMessages((prev) =>
        prev.map((msg) =>
          msg.fileId === fileId
            ? {
                ...msg,
                progress: (i + 1) / totalChunks,
                isComplete: i + 1 === totalChunks,
              }
            : msg
        )
      );
    }

    // Show the file after sending finished
    const blob = new Blob([data], { type: file.type });
    const url = URL.createObjectURL(blob);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.fileId === fileId
          ? { ...msg, fileUrl: url, progress: 1, isComplete: true }
          : msg
      )
    );
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList messages={messages} />
      </div>
      {isConnected ? (
        <div className="bg-dark/80 backdrop-blur-sm pt-2">
          <MessageInput
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
          />
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
