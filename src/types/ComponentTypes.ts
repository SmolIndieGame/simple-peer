export enum ConnectionStatus {
  Initializing = "Initializing...",
  Waiting = "Waiting for connection...",
  Connecting = "Connecting...",
  Connected = "Connected",
  Disconnected = "Disconnected",
}

export interface ChatMessage {
  id: string;
  text?: string;
  fileUrl?: string;
  filename?: string;
  isSent: boolean;
  timestamp: Date;

  // For file transfer progress
  fileId?: string;
  progress?: number; // 0 to 1
  isComplete?: boolean;
}

export interface Peer {
  id: string;
  name: string;
}
