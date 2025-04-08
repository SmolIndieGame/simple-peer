import React from "react";
import { ConnectionStatus } from "../types/ComponentTypes";

interface Props {
  status: ConnectionStatus;
}

const ConnectionStatusIndicator: React.FC<Props> = ({ status }) => {
  const getStatusColor = (prefix: "text" | "bg" = "text") => {
    switch (status) {
      case ConnectionStatus.Connected:
        return `${prefix}-accent`;
      case ConnectionStatus.Waiting:
        return `${prefix}-primary`;
      case ConnectionStatus.Connecting:
        return `${prefix}-yellow-500`;
      case ConnectionStatus.Initializing:
        return `${prefix}-light`;
      case ConnectionStatus.Disconnected:
        return `${prefix}-red-500`;
      default:
        return `${prefix}-light`;
    }
  };

  return (
    <div className="flex items-center space-x-2 animate-pulse">
      <div className={`w-2 h-2 rounded-full ${getStatusColor("bg")}`}></div>
      <span className={`${getStatusColor()} pb-[0.1em]`}>{status}</span>
    </div>
  );
};

export default ConnectionStatusIndicator;
