import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {useParams} from 'react-router-dom'
import { useContext } from 'react';
import WsContext from '../contexts/WsContext';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import StockChart from './StockChart';
function Detail() {
   const range = '1d'
   const lastCandleRef = useRef(null);
   const interval = '1m' // this are the default values can change as well
    // take the id from the params and then ask the backend to give data about this stock and then whatever the backend gives show it here
    const {id} = useParams();
    const {ws}:any = useContext(WsContext);
    const [data , setData]:any = useState(null);
   const [historyData, setHistoryData] = useState([]);
   const [liveCandle, setLiveCandle] = useState(null);
   const [loading , setLoading] = useState(true);
     const updateCurrentCandle = (price)=>{
        if(!lastCandleRef.current){
            return;
        }
         const updatedCandle = {
            ...lastCandleRef.current , 
            high : Math.max(price , lastCandleRef.current.high) , 
            low : Math.min(price , lastCandleRef.current.low) , 
            close : price
         };
         lastCandleRef.current = updatedCandle
         setLiveCandle(updatedCandle);
     }  
     const createNewCandle = (price , candleTime)=>{
        const newCandle = {
            time: candleTime,
            open: price,
            high: price,
            low: price,
            close: price,
                };
                lastCandleRef.current = newCandle
                 setLiveCandle(newCandle);
                
     }
    useEffect(()=>{
        // send the data to backend to subscribe to this stock and then via the ws whenever we receive the message of this stock then set the data to it
      const handleEvent = (message:any)=>{
 const res = JSON.parse(message.data);
        if( res.type === 'price-update' && res.data?.id === id){
            // make sure that the data you received is of the same candle or different
            const timeData = res.data.time;  // this is the time which we get from the ws
            // now check if the minute matches with the last candle or not

            // convert to secs 
            const tickTime = Math.floor(timeData / 1000) + 19800;
            const candleTime = Math.floor(tickTime / 60) * 60; // for a one minute chart we can change when we do give options in what ranges and intervals to choose
            if (!lastCandleRef.current) return;
           
            if(lastCandleRef.current.time === candleTime){
            // that means it is the same candle then just update the last candle
            updateCurrentCandle(res.data.price);
            }
            else{
                createNewCandle(res.data.price ,candleTime )
            }
            
            setData(res.data);
            if(loading == true){
            setLoading(false);
            }
        }
        }
        const subscribe = ()=>{
            ws.send(JSON.stringify({
            type : "subscribe" , 
            stock : [id] 
        }));
        }
        ws.addEventListener("message" , handleEvent);
        if(ws.readyState === WebSocket.OPEN){
            subscribe();
        }
        else{
        ws.addEventListener("open", subscribe, { once: true });
        }


        // get the historic data

        const getData = async()=>{
            const response = await axios.get(`http://localhost:8080/history/${id}?range=${range}&interval=${interval}`);
           lastCandleRef.current = response.data.lastCandle;
           setLiveCandle(response.data.lastCandle);
            setHistoryData(response.data.historyData);
        }
        getData();
        return ()=>{
            ws.removeEventListener("message", handleEvent);
            ws.removeEventListener("open", subscribe);
             if(ws.readyState === WebSocket.OPEN){
             ws.send(
            JSON.stringify({
                type: "unsubscribe",
                stock: [id],
            })
        );}
        }
    } , [id , ws])


    if(loading){
        return(
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading stock details...</p>
          </div>
        )
    }
  return (
    <div className="detail-page">
      {data && 
        <div className="detail-page__header">
          <div className="detail-page__title-group">
            <span className="detail-page__label">Stock Details</span>
            <h1 className="detail-page__symbol">{data.id}</h1>
          </div>
          <div className="detail-page__price-group">
            <div className="detail-page__price">${typeof data.price === 'number' ? data.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : data.price}</div>
            <div className="detail-page__change-row">
              <span className={`detail-page__change ${data.change >= 0 ? 'detail-page__change--positive' : 'detail-page__change--negative'}`}>
                {data.change >= 0 ? '↑' : '↓'} {typeof data.change === 'number' ? Math.abs(data.change).toFixed(2) : data.change}
              </span>
              <span className={`detail-page__change-badge ${data.changePercent >= 0 ? 'detail-page__change-badge--positive' : 'detail-page__change-badge--negative'}`}>
                {data.changePercent >= 0 ? '+' : ''}{typeof data.changePercent === 'number' ? data.changePercent.toFixed(2) : data.changePercent}%
              </span>
            </div>
          </div>
        </div>
      }
      {historyData.length>0 && 
        <div className="detail-page__chart-container">
          <StockChart historyData={historyData} liveCandle={liveCandle}/>
        </div>
      }
    </div>
  )
}

export default Detail