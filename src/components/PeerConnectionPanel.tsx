import React from "react";
import { ConnectionStatus } from "../types/ComponentTypes";
import PeerList from "./PeerList";

interface Props {
  userName: string;
  remoteUserId: string;
  connectionStatus: ConnectionStatus;
  onUserNameChange: (name: string) => void;
  onRemoteUserIdChange: (id: string) => void;
  onConnect: () => void;
  onPeerSelect: (peer: { id: string; name: string }) => void;
}

const PeerConnectionPanel: React.FC<Props> = ({
  userName,
  remoteUserId,
  connectionStatus,
  onUserNameChange,
  onRemoteUserIdChange,
  onConnect,
  onPeerSelect,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mb-6">
        <label className="block text-sm text-light mb-1">Your Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          placeholder="Enter your name"
          className="input w-full mb-4"
        />

        <label className="block text-sm text-light mb-1">Connect to Peer</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={remoteUserId}
            onChange={(e) => onRemoteUserIdChange(e.target.value)}
            placeholder="Enter remote peer ID"
            className="input flex-1 min-w-0"
          />
          <button
            onClick={onConnect}
            disabled={
              !remoteUserId || connectionStatus !== ConnectionStatus.Waiting
            }
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect
          </button>
        </div>
      </div>

      <div className="mt-6">
        <PeerList
          onPeerSelect={onPeerSelect}
          systemReady={connectionStatus === ConnectionStatus.Waiting}
        />
      </div>
    </div>
  );
};

export default PeerConnectionPanel;
