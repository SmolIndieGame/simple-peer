import { useState, useEffect } from "react";
import { DataConnection, Peer } from "peerjs";
import {
  userIdToPeerId,
  getStoredUserId,
  getStoredUserName,
} from "../utils/peerUtils";
import { ConnectionStatus } from "../types/ComponentTypes";
import ConnectionStatusIndicator from "./ConnectionStatusIndicator";
import PeerConnectionPanel from "./PeerConnectionPanel";
import ActiveChatPanel from "./ActiveChatPanel";
import { PeerMessage } from "../types/PeerMessage";
import toast from "react-hot-toast";

const PeerChatManager = () => {
  const userId = getStoredUserId();

  const [userName, setUserName] = useState(getStoredUserName());
  const [remoteUserName, setRemoteUserName] = useState("");
  const [remoteUserId, setRemoteUserId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Initializing,
  );
  const [peer, setPeer] = useState<Peer | null>(null);
  const [conn, setConn] = useState<DataConnection | null>(null);

  const updatePeerList = (newPeerId: string, newPeerName: string) => {
    const storedPeers = localStorage.getItem("peers");
    const peers: { id: string; name: string }[] = storedPeers
      ? JSON.parse(storedPeers)
      : [];
    if (!peers.some((peer) => peer.id === newPeerId)) {
      peers.push({ id: newPeerId, name: newPeerName });
      localStorage.setItem("peers", JSON.stringify(peers));
    }
  };

  const handleUserNameChange = (name: string) => {
    setUserName(name);
    localStorage.setItem("userName", name);
  };

  const setupConnection = (connection: DataConnection, remoteId: string) => {
    setConn(connection);
    setRemoteUserId(remoteId);
    setConnectionStatus(ConnectionStatus.Connecting);

    connection.on("open", () => {
      setConnectionStatus(ConnectionStatus.Connected);
      if (userName) {
        connection.send({
          type: "userName",
          name: userName,
        } satisfies PeerMessage);
      }
    });

    connection.on("data", (data: unknown) => {
      const message = data as PeerMessage;
      if (message && message.type === "userName") {
        setRemoteUserName(message.name);
        updatePeerList(remoteId, message.name);
      }
    });
  };

  useEffect(() => {
    if (!userId) return;
    const newPeer = new Peer(userIdToPeerId(userId), {
      debug: import.meta.env.DEV ? 3 : 0,
      secure: true,
    });
    setPeer(newPeer);
    setConnectionStatus(ConnectionStatus.Initializing);

    newPeer.on("open", () => {
      setConnectionStatus(ConnectionStatus.Waiting);
    });

    newPeer.on("connection", (connection) => {
      const newPeerId = connection.peer.substring(connection.peer.length - 11);
      setupConnection(connection, newPeerId);
    });

    newPeer.on("error", (err) => {
      toast.error(`Connection Error: ${err.type}`);
      closeConnection(conn);
    });

    return () => {
      if (newPeer) {
        newPeer.destroy();
        setConnectionStatus(ConnectionStatus.Disconnected);
      }
    };
  }, [userId]);

  const connectToPeer = (otherUserId?: string) => {
    if (peer && otherUserId) {
      const connection = peer.connect(userIdToPeerId(otherUserId));
      setupConnection(connection, otherUserId);
      // setConnectionStatus(ConnectionStatus.Connecting);

      // connection.on("open", () => {
      // });

      // connection.on("error", () => {
      //   toast.error(`Connection Error`);
      //   closeConnection(connection);
      // });
    }
  };

  const closeConnection = (connection: DataConnection | null) => {
    connection?.close();
    setConn(null);
    // setRemoteUserId("");
    setRemoteUserName("");
    setConnectionStatus(ConnectionStatus.Waiting);
  };

  return (
    <div className="flex flex-col overflow-hidden flex-1">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-light/10 text-xs xs:text-sm">
        <ConnectionStatusIndicator status={connectionStatus} />
        <div className="font-mono bg-dark/50 py-1 rounded">ID: {userId}</div>
      </div>

      {!conn ? (
        <PeerConnectionPanel
          userName={userName}
          remoteUserId={remoteUserId}
          connectionStatus={connectionStatus}
          onUserNameChange={handleUserNameChange}
          onRemoteUserIdChange={setRemoteUserId}
          onConnect={() => connectToPeer(remoteUserId)}
          onPeerSelect={(peer) => {
            setRemoteUserId(peer.id);
            connectToPeer(peer.id);
          }}
        />
      ) : (
        <ActiveChatPanel
          remoteUserName={remoteUserName}
          remoteUserId={remoteUserId}
          onDisconnect={() => closeConnection(conn)}
          conn={conn}
          userId={userId}
        />
      )}
    </div>
  );
};

export default PeerChatManager;
