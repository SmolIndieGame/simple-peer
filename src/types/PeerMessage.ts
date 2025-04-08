type TextMessage = {
  type: "textMessage";
  message: string;
};

type UserNameMessage = {
  type: "userName";
  name: string;
};

type FileMessage = {
  type: "file";
  filename: string;
  filetype: string;
  data: ArrayBuffer;
};

type FileChunkMessage = {
  type: "fileChunk";
  fileId: string;
  filename: string;
  filetype: string;
  totalSize: number;
  chunkIndex: number;
  totalChunks: number;
  data: ArrayBuffer;
};

export type PeerMessage =
  | TextMessage
  | UserNameMessage
  | FileMessage
  | FileChunkMessage
  | undefined;
