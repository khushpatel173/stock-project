import { useEffect, useRef, useState } from "react"
import stockService from "../services/stock";
import { useContext } from "react";
import WsContext from "../contexts/WsContext";
import { Link } from "react-router-dom";

function Portfolio() {
    const [portfolio , setPortfolio] = useState(new Map());
    const stockNames = useRef([]);
    let totalPnl = 0;
    portfolio.forEach((value , key) =>{
        totalPnl+= (value.ltp - value.buy) * value.qty
    });
    let totalInvested = 0;
    portfolio.forEach((value , key) =>{
        totalInvested+= (value.buy * value.qty)
    });
    let currentValue = 0;
    portfolio.forEach((value , key) =>{
        currentValue+= (value.ltp * value.qty);
    });
    const {ws}:any = useContext(WsContext);
    const subscribe = (stock)=>{
            ws.send(JSON.stringify({
            type : "subscribe" , 
            stock :  stock
        }));
        }
       
        const handleMessage = (event)=>{
      const data = JSON.parse(event.data);
        //  check if the data which is coming is in your portfolio or not
      
 setPortfolio((prev) =>{
        if(!prev.has(data.data.id)){
            return prev;
        }
          
            const updated = new Map(prev);
            updated.set(data.data.id , {
                ...updated.get(data.data.id) ,
                ltp : data.data.price , 
            });
            return updated;
        }); 
}
    useEffect(()=>{
        // as the page loads fetch the portfolio of the logged in user
       
        const getPort = async()=>{
            const res = await stockService.portfolio();
            const portfolio = res.portfolio.stocks; // arr of stock
            stockNames.current = portfolio.map((stock)=>stock.name);
            // subscribe to all who are in portfolio 
            const newMap = new Map();
            portfolio.map((stock) =>{
                newMap.set(stock.name , {
                   ...stock , ltp : stock.buy 
                });
                return stock;
            });
             setPortfolio(newMap);
             
            // subscribe
            // const stocknames = portfolio.map((stock) => (stock.name));
            ws.addEventListener("message" ,handleMessage);
              if(ws.readyState === WebSocket.OPEN){
            subscribe(stockNames.current);
        }
        else{
ws.addEventListener("open" , ()=>{subscribe(stockNames.current)});
        }
    }
        // now they are also subscribed
        getPort();
        return ()=>{
        ws.removeEventListener("message", handleMessage);
        // unsubscribe when we unmount
         if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({
            type : "unsubscribe" , 
            stock : stockNames.current
        }));
    }
        }
    } , [])
  return (
    <div className="portfolio-page">
      <div className="portfolio-page__header">
        <div>
          <span className="portfolio-page__label">Your Portfolio</span>
          <h1 className="portfolio-page__title">Holdings</h1>
        </div>
      </div>

      <div className="portfolio-page__summary-grid">
        <div className="portfolio-summary-card">
          <div className="portfolio-summary-card__icon portfolio-summary-card__icon--invested">💰</div>
          <div className="portfolio-summary-card__content">
            <span className="portfolio-summary-card__label">Total Invested</span>
            <span className="portfolio-summary-card__value">${totalInvested.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>
        <div className="portfolio-summary-card">
          <div className="portfolio-summary-card__icon portfolio-summary-card__icon--current">📊</div>
          <div className="portfolio-summary-card__content">
            <span className="portfolio-summary-card__label">Current Value</span>
            <span className="portfolio-summary-card__value">${currentValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>
        <div className="portfolio-summary-card">
          <div className={`portfolio-summary-card__icon ${totalPnl >= 0 ? 'portfolio-summary-card__icon--profit' : 'portfolio-summary-card__icon--loss'}`}>{totalPnl >= 0 ? '📈' : '📉'}</div>
          <div className="portfolio-summary-card__content">
            <span className="portfolio-summary-card__label">Total P&L</span>
            <span className={`portfolio-summary-card__value ${totalPnl >= 0 ? 'portfolio-summary-card__value--positive' : 'portfolio-summary-card__value--negative'}`}>
              {totalPnl >= 0 ? '+' : ''}{totalPnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          </div>
        </div>
      </div>

      <div className="portfolio-page__holdings-header">
        <h2 className="portfolio-page__holdings-title">Your Stocks</h2>
        <span className="portfolio-page__holdings-count">{portfolio.size} holding{portfolio.size !== 1 ? 's' : ''}</span>
      </div>

      {portfolio.size === 0 ? (
        <div className="portfolio-page__empty">
          <div className="portfolio-page__empty-icon">📭</div>
          <p className="portfolio-page__empty-text">No holdings yet. Start trading to build your portfolio!</p>
        </div>
      ) : (
        <div className="portfolio-holdings-table">
          <div className="portfolio-holdings-table__head">
            <span>Stock</span>
            <span>Qty</span>
            <span>Avg. Buy</span>
            <span>LTP</span>
            <span>Invested</span>
            <span>Current</span>
            <span>P&L</span>
          </div>
          {Array.from(portfolio.entries()).map(([key, value]) => {
            const pnl = (value.ltp - value.buy) * value.qty;
            const invested = value.qty * value.buy;
            const current = value.qty * value.ltp;
            return (
              <Link to={`/${value.name}`}>
              <div className="portfolio-holdings-table__row" key={key}>
                <span className="portfolio-holdings-table__stock">{value.name}</span>
                <span className="portfolio-holdings-table__cell">{value.qty}</span>
                <span className="portfolio-holdings-table__cell">${value.buy.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className="portfolio-holdings-table__cell">${value.ltp.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className="portfolio-holdings-table__cell">${invested.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className="portfolio-holdings-table__cell">${current.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className={`portfolio-holdings-table__pnl ${pnl >= 0 ? 'portfolio-holdings-table__pnl--positive' : 'portfolio-holdings-table__pnl--negative'}`}>
                  {pnl >= 0 ? '+' : ''}{pnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default Portfolio