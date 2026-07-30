import { useRef } from "react";
import WsContext from "./WsContext";

const WsContextProvider = ({ children }: any) => {

    const ws = useRef(
        new WebSocket("wss://stockify-kmw5.onrender.com")
    );
  

    return (
        <WsContext.Provider value={{ ws: ws.current}
        }>
            {children}
        </WsContext.Provider>
    );
};

export default WsContextProvider;