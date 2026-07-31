import  { useEffect, useState } from 'react'
import { useSelector} from 'react-redux'
import stockService from '../services/stock';
import { useContext } from 'react';
import WsContext from '../contexts/WsContext';
export default function Order() {
    const {ws}:any = useContext(WsContext);
    const userData:any = useSelector((state:any) => (state.auth.userData));
    const [orders , setOrders] = useState([]);
    const [stockPrice , setStockPrice] = useState(new Map());
    const [loading , setLoading] = useState(true);
    const handleMessage = (event:any)=>{
      const data = JSON.parse(event.data);
      if(data.type == "price-update"){
         setStockPrice((prev) =>{
            if(!prev.has(data.data.id)){
                return prev;
            }
            const updated = new Map(prev);
            updated.set(data.data.id , data.data.price);
            return updated;
        }); 
        console.log(stockPrice);
      }
    }
   useEffect(()=>{
    // get the orders of this user
    if(!userData){
      return;
    }
    const getOrders = async()=>{
      const res = await stockService.getOrder();
      const orders = res.orders;
      console.log(orders);
      
      setOrders(orders);
      if(loading == true){
      setLoading(false);
      }
            const newMap = new Map();
            orders.map((order:any) =>{
              // only for the pending ones
              if(order.status == "PENDING"){
                newMap.set(order.symbol , 0);
              }
                return order;
            });
          setStockPrice(newMap);
    }
    getOrders();
     ws.addEventListener("message" ,handleMessage);
   } , [])

       if(loading){
        return (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading Orders...</p>
             <button className="refresh-btn" onClick={()=>{
              window.location.reload();
         }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Refresh
      </button>
          </div>
        )
    }

  return (
    <div className="orders-page">
      <div className="orders-page__header">
        <h1 className="orders-page__title">Your Orders</h1>
      </div>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No orders found.
        </div>
      ) : (
        <div className="orders-page__list">
          {orders.map((order: any, index: number) => {
            const isBuy = order.type === 'BUY';
            const isExecuted = order.status === 'EXECUTED';
         
            return (
              <div key={index} className="order-card">
                <div className="order-card__header">
                  <div className="order-card__symbol">
                    {order.symbol}
                    <span className={`order-card__badge ${isBuy ? 'order-card__badge--buy' : 'order-card__badge--sell'}`}>
                      {order.type}
                    </span>
                  </div>
                  <span className={`order-card__status order-card__status--${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="order-card__body">
                  <div className="order-card__stat">
                    <span className="order-card__label">Quantity</span>
                    <span className="order-card__value">{order.qty}</span>
                  </div>
                  <div className="order-card__stat">
                    <span className="order-card__label">Order Type</span>
                    <span className="order-card__value" style={{textTransform: 'capitalize'}}>{order.orderType?.toLowerCase() || 'Market'}</span>
                  </div>
                  <div className="order-card__stat">
                    <span className="order-card__label">Requested Price</span>
                    <span className="order-card__value">${order.requestedPrice?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="order-card__stat">
                    <span className="order-card__label">Executed Price</span>
                    <span className="order-card__value">
                      {isExecuted && order.executedPrice ? `$${order.executedPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
                    </span>
                  </div>
                  {order.status === "PENDING" && (
                    <div className="order-card__stat" style={{ gridColumn: '1 / -1' }}>
                      <span className="order-card__label">Live Price</span>
                      <span className="order-card__value" style={{ color: 'var(--color-primary)' }}>
                        {stockPrice.has(order.symbol) && stockPrice.get(order.symbol) !== 0 
                          ? `$${Number(stockPrice.get(order.symbol)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                          : "-"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
