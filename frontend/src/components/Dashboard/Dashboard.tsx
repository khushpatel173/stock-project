import { useState } from "react";
import StockCard from "./StockCard";
import { useContext } from "react";
import WsContext from "../../contexts/WsContext";
function Dashboard() {
    const {ws}:any = useContext(WsContext);
    const[stocks , setStocks] = useState(new Map());
    ws.onopen = () => {
    console.log("Connected to backend");
};

ws.onmessage = (event:any) => {
    // console.log(JSON.parse(event.data));

    const data = JSON.parse(event.data);
    setStocks((prev) => {
      const updated = new Map(prev);
      updated.set(data.data.id , data.data);
      return updated
    })
};
  return (
      <>
     {Array.from(stocks.values()) .map((stock) => (
    <StockCard
        key={stock.id}
        price={stock.price}
        id={stock.id}
        change={stock.change}
        changePercent={stock.changePercent}
    />
))}
      </>
  )
}

export default Dashboard