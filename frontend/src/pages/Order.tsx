import React, { useEffect, useState } from 'react'
import { useSelector} from 'react-redux'
import stockService from '../services/stock';

export default function Order() {
    const userData = useSelector((state) => (state.auth.userData));
    const [orders , setOrders] = useState([]);
   useEffect(()=>{
    // get the orders of this user
    if(!userData){
      return;
    }
    const getOrders = async()=>{
      const res = await stockService.getOrder(userData._id);
      const orders = res.orders;
      setOrders(orders);
    }
    getOrders();
   } , [])
  return (
    <>
    <div>Orders</div>
    {orders.map((order)=>{
      return (
        <div>
        <span>{order.symbol}</span>
        <br />
        <span>{order.qty}</span>
        <br />
        <span> Order Price:  {order.requestedPrice}</span>
        <br />
        <span>{order.type}</span>
        <br />
        <span>{order.status}</span>
        <br />
        <span>{order.orderType}</span>
        <br />
        <span>{(order.status == "EXECUTED") ? order.executedPrice : "-"}</span>
        <br />
        </div>
      )
    })}
    </>
  )
}
