import React, { useState, useRef, useEffect } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onSendFile?: (file: File, data: ArrayBuffer) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendFile,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file && onSendFile) {
            const arrayBuffer = await file.arrayBuffer();
            onSendFile(file, arrayBuffer);
            e.target.value = ""; // reset input
          }
        }}
      />
      <div className="flex items-end border border-light/20 rounded-lg bg-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 p-3 bg-transparent border-none outline-none resize-none text-lighter min-h-[44px] max-h-[120px]"
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="p-3 text-primary hover:text-white hover:bg-primary transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            const fileInput = document.getElementById(
              "fileInput"
            ) as HTMLInputElement;
            fileInput?.click();
          }}
          className="p-3 text-primary hover:text-white hover:bg-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 12l1.5-1.5M4 8l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
