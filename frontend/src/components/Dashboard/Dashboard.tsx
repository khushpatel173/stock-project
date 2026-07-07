import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import { useContext } from "react";
import WsContext from "../../contexts/WsContext";
import { Link } from "react-router-dom";

function Dashboard() {
    const {ws}:any = useContext(WsContext);
    const[stocks , setStocks] = useState(new Map());
    const defaultStocks = ['BTC-USD' , 'ETH-USD' , 'SOL-USD' , 'BNB-USD'];
    const[loading , setLoading] = useState(true);

  const subscribe = ()=>{
            ws.send(JSON.stringify({
            type : "subscribe" , 
            stock : defaultStocks 
        }));
        }
        const handleMessage = (event:any)=>{

        
              const data = JSON.parse(event.data);
            
      if(!defaultStocks.includes(data.data.id)){return}
    setStocks((prev) => {
      const updated = new Map(prev);
      updated.set(data.data.id , data.data);
      return updated
    })
    if(loading==true){
    setLoading(false);
    }
        }
useEffect(()=>{
  

// ws.onmessage = (event:any) => {
//     // console.log(JSON.parse(event.data));
//     handleMessage(event);
// };
      ws.addEventListener("message" , handleMessage);
    // as soon as the page loads give the backend a msg to send the subscribe data
        if(ws.readyState === WebSocket.OPEN){
            subscribe();
        }
        else{
//       ws.onopen = () => {
//     console.log("Connected to backend");
//     subscribe();
// };
          ws.addEventListener("open" , subscribe);
        }

    return ()=>{
        ws.removeEventListener("message", handleMessage);
        ws.removeEventListener("open", subscribe);
        console.log("Event listener removed");
        // unsubscribeeeee
       if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({
            type : "unsubscribe" , 
            stock : defaultStocks
        }));
    }
   
    }
} , [])


    if(loading){
        return (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading market data...</p>
          </div>
        )
    }
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Market Dashboard</h1>
          <p className="dashboard__subtitle">Real-time cryptocurrency prices</p>
        </div>
      </div>
      <div className="dashboard__grid">
        {Array.from(stocks.values()).map((stock) => (
          <Link to={`/${stock.id}`} key={stock.id} className="stock-card-link">
            <StockCard price={stock.price} id={stock.id} change={stock.change} changePercent={stock.changePercent} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard