import React, { useEffect, useState } from "react";

interface Peer {
  id: string;
  name: string;
}

interface PeerListProps {
  onPeerSelect: (peer: Peer) => void;
  systemReady: boolean;
}

const PeerList: React.FC<PeerListProps> = ({ onPeerSelect, systemReady }) => {
  const [peers, setPeers] = useState<Peer[]>([]);

  useEffect(() => {
    // Retrieve previously connected peers from localStorage
    const storedPeers = localStorage.getItem("peers");
    if (storedPeers) {
      setPeers(JSON.parse(storedPeers));
    }
  }, []);

  const handleClick = (peer: Peer) => {
    if (systemReady) {
      onPeerSelect(peer);
    }
  };

  return (
    <div className="card bg-dark/50">
      <h2 className="text-lg font-medium mb-3 text-primary">
        Recent Connections
      </h2>
      {peers.length === 0 ? (
        <div className="text-light/60 text-sm py-3 text-center border border-dashed border-light/10 rounded-md">
          No previous connections found
        </div>
      ) : (
        <ul className="space-y-2">
          {peers.map((peer) => (
            <li
              key={peer.id}
              onClick={() => handleClick(peer)}
              className={`
                p-3 rounded-md border border-light/10 transition-all duration-200
                ${
                  systemReady
                    ? "hover:border-primary/50 hover:bg-dark cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{peer.name || "Anonymous"}</div>
                  <div className="text-xs text-light font-mono">{peer.id}</div>
                </div>
                {systemReady && (
                  <div className="text-primary text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PeerList;
