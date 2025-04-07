import { useState, useEffect } from "react";
import { DataConnection, Peer } from "peerjs";
import Chat from "./Chat";
import { PeerMessage } from "../types/PeerMessage";
import PeerList from "./PeerList";

const userIdToPeerId = (userId: string) => {
  const appGuid = import.meta.env.VITE_APP_GUID;
  return `${appGuid}-${userId}`;
};

const generateUserId = () => {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let userId = "";
  for (let i = 0; i < 11; i++) {
    userId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return userId;
};

const getStoredUserId = () => {
  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
    return storedUserId;
  } else {
    const newUserId = generateUserId();
    localStorage.setItem("userId", newUserId);
    return newUserId;
  }
};

const getStoredUserName = () => {
  const storedUserName = localStorage.getItem("userName");
  return storedUserName || "";
};

enum ConnectionStatus {
  Initializing = "Initializing...",
  Waiting = "Waiting for connection...",
  Connecting = "Connecting...",
  Connected = "Connected",
  Disconnected = "Disconnected",
}

const ChatInterface = () => {
  const userId = getStoredUserId();

  const [userName, setUserName] = useState(getStoredUserName());
  const [remoteUserName, setRemoteUserName] = useState("");
  const [remoteUserId, setRemoteUserId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Initializing
  );
  const [peer, setPeer] = useState<Peer | null>(null);
  const [conn, setConn] = useState<DataConnection | null>(null);

  const updatePeerList = (newPeerId: string, newPeerName: string) => {
    const storedPeers = localStorage.getItem("peers");
    const peers: { id: string; name: string }[] = storedPeers
      ? JSON.parse(storedPeers)
      : [];
    // Check if peer already exists
    if (!peers.some((peer) => peer.id === newPeerId)) {
      peers.push({ id: newPeerId, name: newPeerName });
      localStorage.setItem("peers", JSON.stringify(peers));
    }
  };

  const handleUserNameChange = (name: string) => {
    setUserName(name);
    localStorage.setItem("userName", name);
  };

  useEffect(() => {
    if (!userId) return;
    const newPeer = new Peer(userIdToPeerId(userId));
    setPeer(newPeer);
    setConnectionStatus(ConnectionStatus.Initializing);

    newPeer.on("open", () => {
      setConnectionStatus(ConnectionStatus.Waiting);
    });

    newPeer.on("connection", (connection) => {
      setConn(connection);
      const newPeerId = connection.peer.substring(connection.peer.length - 11);
      setRemoteUserId(newPeerId);
      setConnectionStatus(ConnectionStatus.Connected);

      connection.on("open", () => {
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
          updatePeerList(newPeerId, message.name);
        }
      });
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
      setConnectionStatus(ConnectionStatus.Connecting);

      connection.on("open", () => {
        setConn(connection);
        setConnectionStatus(ConnectionStatus.Connected);
        if (userName) {
          connection.send({ type: "userName", name: userName });
        }
      });

      connection.on("data", (data: unknown) => {
        const message = data as PeerMessage;
        if (message && message.type === "userName") {
          setRemoteUserName(message.name);
          updatePeerList(otherUserId, message.name);
        }
      });
    }
  };

  const closeConnection = () => {
    conn?.close();
    setConn(null);
    setRemoteUserId("");
    setRemoteUserName("");
    setConnectionStatus(ConnectionStatus.Waiting);
  };

  // Get status color based on connection status
  const getStatusColor = () => {
    switch (connectionStatus) {
      case ConnectionStatus.Connected:
        return "text-accent";
      case ConnectionStatus.Waiting:
        return "text-primary";
      case ConnectionStatus.Connecting:
        return "text-yellow-500";
      case ConnectionStatus.Initializing:
        return "text-light";
      case ConnectionStatus.Disconnected:
        return "text-red-500";
      default:
        return "text-light";
    }
  };

  return (
    <div className="flex flex-col overflow-hidden flex-1">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-light/10">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}
          ></div>
          <span className={`text-sm ${getStatusColor()}`}>
            {connectionStatus}
          </span>
        </div>
        <div className="text-sm font-mono bg-dark/50 px-2 py-1 rounded">
          ID: {userId}
        </div>
      </div>

      {!conn ? (
        <div className="flex-1 overflow-y-auto">
          <div className="mb-6">
            <label className="block text-sm text-light mb-1">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => handleUserNameChange(e.target.value)}
              placeholder="Enter your name"
              className="input w-full mb-4"
            />

            <label className="block text-sm text-light mb-1">
              Connect to Peer
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={remoteUserId}
                onChange={(e) => setRemoteUserId(e.target.value)}
                placeholder="Enter remote peer ID"
                className="input flex-1"
              />
              <button
                onClick={() => connectToPeer(remoteUserId)}
                disabled={
                  !userId ||
                  !remoteUserId ||
                  connectionStatus !== ConnectionStatus.Waiting
                }
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect
              </button>
            </div>
          </div>

          <div className="mt-6">
            <PeerList
              onPeerSelect={(peer) => {
                setRemoteUserId(peer.id);
                connectToPeer(peer.id);
              }}
              systemReady={connectionStatus === ConnectionStatus.Waiting}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-accent mr-2"></div>
              <span className="font-medium">
                {remoteUserName ? remoteUserName : "Anonymous"}
              </span>
              <span className="text-xs text-light ml-2 font-mono">
                ({remoteUserId})
              </span>
            </div>
            <button
              onClick={closeConnection}
              className="btn btn-danger text-sm px-3 py-1"
            >
              Disconnect
            </button>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <Chat conn={conn} peerId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
