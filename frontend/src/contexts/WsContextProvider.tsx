import { useRef } from "react";
import WsContext from "./wsContext";

const WsContextProvider = ({ children }: any) => {

    const ws = useRef(
        new WebSocket("ws://localhost:8080")
    );

    return (
        <WsContext.Provider value={{ ws: ws.current }}>
            {children}
        </WsContext.Provider>
    );
};

export default WsContextProvider;