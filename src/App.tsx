import { Toaster } from "react-hot-toast";
import PeerChatManager from "./components/PeerChatManager";

function App() {
  return (
    <div className="flex flex-col overflow-hidden h-screen bg-gradient-to-b from-darker to-dark text-lighter">
      <div className="flex flex-col overflow-hidden flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Simple Peer
          </h1>
          <div className="animate-pulse-slow text-primary">
            <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2"></span>
            P2P Secure Chat
          </div>
        </header>
        <main className="flex flex-col overflow-hidden flex-1 card animate-fade-in">
          <PeerChatManager />
        </main>
        <footer className="mt-6 text-center text-xs text-light/60">
          <p>Secure P2P Chat • No server storage • End-to-end encryption</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
