import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {useParams} from 'react-router-dom'
import { useContext } from 'react';
import WsContext from '../contexts/WsContext';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import stockService from '../services/stock';
import StockChart from './StockChart';
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateBalance } from '../../store/authSlice';
function Detail() {
   const range = '1d'
   const dispatch = useDispatch();
   const lastCandleRef = useRef(null);
   const navigate = useNavigate();
   const interval = '1m' // this are the default values can change as well
    // take the id from the params and then ask the backend to give data about this stock and then whatever the backend gives show it here
    const {id} = useParams();
    const [form_buy , setFormBuy] = useState(false);
    const [form_sell , setFormSell] = useState(false);
    const [qty , setQty] = useState(1);
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
            ...lastCandleRef.current,
            high : Math.max(price , lastCandleRef.current.high),
            low : Math.min(price , lastCandleRef.current.low),
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
            try {
               const response = await axios.get(`http://localhost:8080/history/${id}?range=${range}&interval=${interval}`);
           console.log(response.data.historyData);
            lastCandleRef.current = response.data.lastCandle;
           setLiveCandle(response.data.lastCandle);
            setHistoryData(response.data.historyData);
          const last_price = response.data.lastCandle.close;
          setData({
            id : id , 
            price : last_price ,
            change : 0,
            changePercent : 0 , 
            text : "Last traded Price"
          });
          setLoading(false);
            } catch (error) {
              console.log("Something went wrong")
            }
           
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
              
          {data.text ? <span className="detail-page__status-badge">Last Traded Price</span> : <>
          <span className={`detail-page__change ${data.change >= 0 ? 'detail-page__change--positive' : 'detail-page__change--negative'}`}>
                {data.change >= 0 ? '↑' : '↓'} {typeof data.change === 'number' ? Math.abs(data.change).toFixed(2) : data.change}
              </span>
              <span className={`detail-page__change-badge ${data.changePercent >= 0 ? 'detail-page__change-badge--positive' : 'detail-page__change-badge--negative'}`}>
                {data.changePercent >= 0 ? '+' : ''}{typeof data.changePercent === 'number' ? data.changePercent.toFixed(2) : data.changePercent}%
              </span>
              <span className="detail-page__live-badge"><span className="detail-page__live-dot"></span>Live</span>

              <div className="detail-page__trade-actions">
                <button className="detail-page__trade-btn detail-page__trade-btn--buy" onClick={()=>{
                  setFormBuy(true);
                  setFormSell(false);
                }}>Buy</button>
                <button className="detail-page__trade-btn detail-page__trade-btn--sell" onClick={()=>{
                  setFormSell(true);
                  setFormBuy(false);
                }}>Sell</button>
              </div>
          </>}
            </div>
          </div>
        </div>
      }

      {form_buy && <div className="trade-modal-overlay" onClick={() => setFormBuy(false)}>
        <div className="trade-modal" onClick={(e) => e.stopPropagation()}>
          <div className="trade-modal__header trade-modal__header--buy">
            <div className="trade-modal__header-icon">📈</div>
            <h2 className="trade-modal__title">Buy {data.id}</h2>
            <button className="trade-modal__close" onClick={() => setFormBuy(false)}>✕</button>
          </div>
          <div className="trade-modal__body">
            <div className="trade-modal__field">
              <label className="trade-modal__label">Quantity</label>
              <input className="trade-modal__input" type="text" placeholder='Enter quantity' value={qty} onChange={(e)=>{
                  setQty(Number(e.target.value));
              }}/>
            </div>
            <div className="trade-modal__summary">
              <div className="trade-modal__summary-row">
                <span className="trade-modal__summary-label">Last Traded Price</span>
                <span className="trade-modal__summary-value">${typeof data.price === 'number' ? data.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : data.price}</span>
              </div>
              <div className="trade-modal__summary-row">
                <span className="trade-modal__summary-label">Quantity</span>
                <span className="trade-modal__summary-value">{qty}</span>
              </div>
              <div className="trade-modal__divider"></div>
              <div className="trade-modal__summary-row trade-modal__summary-row--total">
                <span className="trade-modal__summary-label">Estimated Total</span>
                <span className="trade-modal__summary-value trade-modal__summary-value--highlight">${(qty * data.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
          <div className="trade-modal__actions">
            <button className="trade-modal__btn trade-modal__btn--cancel" onClick={()=>{
              setFormBuy(false);
            }}>Cancel</button>
            <button className="trade-modal__btn trade-modal__btn--confirm trade-modal__btn--buy" onClick={async()=>{
              try {
               const res =  await stockService.buy(data.id , qty);
               console.log(res);
               if(res){
                alert("Successfully purchased");
               }
               setFormBuy(false);
              //  set the balance
               dispatch(updateBalance(res.user))
               navigate("/portfolio")
              } catch (error) {
                console.log("error :" , error.message);  
              }
            }}>Confirm Buy</button>
          </div>
        </div>
      </div>}

      {form_sell && <div className="trade-modal-overlay" onClick={() => setFormSell(false)}>
        <div className="trade-modal" onClick={(e) => e.stopPropagation()}>
          <div className="trade-modal__header trade-modal__header--sell">
            <div className="trade-modal__header-icon">📉</div>
            <h2 className="trade-modal__title">Sell {data.id}</h2>
            <button className="trade-modal__close" onClick={() => setFormSell(false)}>✕</button>
          </div>
          <div className="trade-modal__body">
            <div className="trade-modal__field">
              <label className="trade-modal__label">Quantity</label>
              <input className="trade-modal__input" type="text" placeholder='Enter quantity' value={qty} onChange={(e)=>{
                  setQty(Number(e.target.value));
              }}/>
            </div>
            <div className="trade-modal__summary">
              <div className="trade-modal__summary-row">
                <span className="trade-modal__summary-label">Last Traded Price</span>
                <span className="trade-modal__summary-value">${typeof data.price === 'number' ? data.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : data.price}</span>
              </div>
              <div className="trade-modal__summary-row">
                <span className="trade-modal__summary-label">Quantity</span>
                <span className="trade-modal__summary-value">{qty}</span>
              </div>
              <div className="trade-modal__divider"></div>
              <div className="trade-modal__summary-row trade-modal__summary-row--total">
                <span className="trade-modal__summary-label">Estimated Total</span>
                <span className="trade-modal__summary-value trade-modal__summary-value--highlight">${(qty * data.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
          <div className="trade-modal__actions">
            <button className="trade-modal__btn trade-modal__btn--cancel" onClick={()=>{
              setFormSell(false);
            }}>Cancel</button>
            <button className="trade-modal__btn trade-modal__btn--confirm trade-modal__btn--sell" onClick={async()=>{
              try {
               const res =  await stockService.sell(data.id , qty);
               console.log(res);
               if(res){
                alert("Successfully Sold");
               }
                setFormSell(false);
                dispatch(updateBalance(res.user))
              } catch (error) {
                console.log("error :" , error.message);  
              }
             
              
            }}>Confirm Sell</button>
          </div>
        </div>
      </div>}

      {historyData.length > 0 && 
        <div className="detail-page__chart-container">
          <StockChart historyData={historyData} liveCandle={liveCandle}/>
        </div>
      }
    </div>
  )
}

export default Detail