import { useRef } from "react";
import WsContext from "./WsContext";

const WsContextProvider = ({ children }: any) => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    const ws = useRef(
        new WebSocket(wsUrl)
    );
  

    return (
        <WsContext.Provider value={{ ws: ws.current}
        }>
            {children}
        </WsContext.Provider>
    );
};

export default WsContextProvider;