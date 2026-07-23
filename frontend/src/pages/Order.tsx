import React, { useEffect, useState } from 'react'
import { useSelector} from 'react-redux'
import stockService from '../services/stock';
import { useContext } from 'react';
import WsContext from '../contexts/WsContext';
export default function Order() {
    const {ws}:any = useContext(WsContext);
    const userData = useSelector((state) => (state.auth.userData));
    const [orders , setOrders] = useState([]);
    const [stockPrice , setStockPrice] = useState(new Map());
    const handleMessage = (event)=>{
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
      const res = await stockService.getOrder(userData._id);
      const orders = res.orders;
      console.log(orders);
      
      setOrders(orders);
            const newMap = new Map();
            orders.map((order) =>{
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
