import React from "react";
import type { Peer } from "../types/ComponentTypes";
import { usePeerStore } from "../utils/peerStore";

interface PeerListProps {
  onPeerSelect: (peer: Peer) => void;
  systemReady: boolean;
}

const PeerList: React.FC<PeerListProps> = ({ onPeerSelect, systemReady }) => {
  const { peers, removePeer } = usePeerStore();

  // const [peers, setPeers] = useState<Peer[]>([]);
  // useEffect(() => {
  //   // Retrieve previously connected peers from localStorage
  //   const storedPeers = localStorage.getItem("peers");
  //   if (storedPeers) {
  //     setPeers(JSON.parse(storedPeers));
  //   }
  // }, []);

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
              <div className="flex items-center gap-2">
                <div
                  className="text-red-500 hover:bg-red-500/10 p-1 rounded-md transition-all duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePeer(peer.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">{peer.name || "Anonymous"}</div>
                  <div className="text-xs text-light font-mono">{peer.id}</div>
                </div>
                <div className="flex-1"></div>
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
