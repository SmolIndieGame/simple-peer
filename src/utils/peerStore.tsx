import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Peer } from "../types/ComponentTypes";

type PeerStoreContextType = {
  peers: Peer[];
  addPeer: (newPeerId: string, newPeerName: string) => void;
  removePeer: (peerId: string) => void;
};

const PeerStoreContext = createContext<PeerStoreContextType | undefined>(
  undefined
);

export const PeerStoreProvider = ({ children }: { children: ReactNode }) => {
  const [peers, setPeers] = useState<Peer[]>([]);

  // Load peers from localStorage on initial mount
  useEffect(() => {
    const storedPeers = localStorage.getItem("peers");
    if (storedPeers) {
      setPeers(JSON.parse(storedPeers));
    }
  }, []);

  const addPeer = (newPeerId: string, newPeerName: string) => {
    setPeers((currentPeers) => {
      if (currentPeers.some((peer) => peer.id === newPeerId)) {
        return currentPeers;
      }

      const newPeers = [...currentPeers, { id: newPeerId, name: newPeerName }];
      localStorage.setItem("peers", JSON.stringify(newPeers));
      return newPeers;
    });
  };

  const removePeer = (peerId: string) => {
    setPeers((currentPeers) => {
      const updatedPeers = currentPeers.filter((peer) => peer.id !== peerId);
      localStorage.setItem("peers", JSON.stringify(updatedPeers));
      return updatedPeers;
    });
  };

  return (
    <PeerStoreContext.Provider value={{ peers, addPeer, removePeer }}>
      {children}
    </PeerStoreContext.Provider>
  );
};

export const usePeerStore = (): PeerStoreContextType => {
  const context = useContext(PeerStoreContext);

  if (context === undefined) {
    throw new Error("usePeerStore must be used within a PeerProvider");
  }

  return context;
};
