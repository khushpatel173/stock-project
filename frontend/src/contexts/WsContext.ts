import { createContext } from "react";

interface WsContextType {
    ws: WebSocket | null;
}

const WsContext = createContext<WsContextType | null>(null);
export default WsContext;