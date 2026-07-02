import { useState } from "react";
import StockCard from "./StockCard";


function Dashboard() {
    const ws = new WebSocket("ws://localhost:8080");
    const[stocks , setStocks] = useState(new Map());
    ws.onopen = () => {
    console.log("Connected to backend");
};

ws.onmessage = (event) => {
    // console.log(JSON.parse(event.data));
    const data = JSON.parse(event.data);
    setStocks((prev) => {
      const updated = new Map(prev);
      updated.set(data.id , data);
      return updated
    })
};
  return (
      <>
     {Array.from(stocks.values()).map((stock) => (
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