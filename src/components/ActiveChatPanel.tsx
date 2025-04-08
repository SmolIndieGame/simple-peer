import React from "react";
import { DataConnection } from "peerjs";
import Chat from "./Chat";

interface Props {
  remoteUserName: string;
  remoteUserId: string;
  onDisconnect: () => void;
  conn: DataConnection;
  userId: string;
}

const ActiveChatPanel: React.FC<Props> = ({
  remoteUserName,
  remoteUserId,
  onDisconnect,
  conn,
  userId,
}) => {
  return (
    <div className="flex flex-col overflow-hidden flex-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="font-medium">
            {remoteUserName ? remoteUserName : "Anonymous"}
          </span>
          <span className="text-xs text-light ml-2 font-mono">
            ({remoteUserId})
          </span>
        </div>
        <button
          onClick={onDisconnect}
          className="btn btn-danger text-sm px-3 py-1"
        >
          Disconnect
        </button>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Chat conn={conn} peerId={userId} />
      </div>
    </div>
  );
};

export default ActiveChatPanel;
