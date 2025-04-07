> **⚠️ Under Development**  
> This project is currently under active development. Features may change, and bugs may exist. Contributions and feedback are welcome!

# Simple Peer - Secure P2P Chat

A secure peer-to-peer chat application built with React, TypeScript, and Peer.js. This application allows users to connect directly to each other for real-time messaging without storing any data on servers.

## Features

- **Secure P2P Communication**: Direct peer-to-peer connections using WebRTC
- **No Server Storage**: All data is stored locally, ensuring privacy
- **User Identification**: Persistent user IDs and customizable usernames
- **Recent Connections**: List of previously connected peers for easy reconnection
- **Real-time Messaging**: Instant message delivery between connected peers
- **Responsive Design**: Works on desktop and mobile devices

## Privacy & Security

Simple Peer is designed with privacy in mind:

- No messages are stored on any server
- All communication happens directly between peers
- User data is stored only in your browser's localStorage
- Chat history is not persisted after the session ends

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm, npm, or yarn package manager

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the root directory with:

   ```
   VITE_APP_GUID=your-app-guid
   ```

   This GUID is used to namespace peer IDs.

3. Start the development server:

   ```bash
   pnpm run dev
   ```

4. Open your browser and navigate to http://localhost:5173

### Building for Production

```bash
pnpm run build
```

The built files will be in the `dist` directory and can be served using any static file server.

## How to Use

1. **Set Your Name**: Enter your name in the input field
2. **Connect to a Peer**:
   - Enter the peer ID of the person you want to chat with, or
   - Select from your list of recent connections
3. **Chat**: Once connected, you can send messages in real-time
4. **Disconnect**: Click the "Disconnect" button to end the chat session

## Technologies Used

- **React.js**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Peer.js**: WebRTC peer-to-peer connection library
- **Vite**: Fast bundler and development server
- **Tailwind CSS**: Utility-first CSS framework

## Browser Compatibility

Simple Peer works on modern browsers that support WebRTC:

- Chrome
- Firefox
- Safari
- Edge

Mobile browser support may vary.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
