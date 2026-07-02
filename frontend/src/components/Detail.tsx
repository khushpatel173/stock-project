
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'
import { useContext } from 'react';
import WsContext from '../contexts/wsContext';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
function Detail() {
   
    // take the id from the params and then ask the backend to give data about this stock and then whatever the backend gives show it here
    // const {id='BTC-USD'} = useParams();
    const id = "BTC-USD"
    const {ws}:any = useContext(WsContext);
    const [data , setData]:any = useState(null);

     
    useEffect(()=>{
        // send the data to backend to subscribe to this stock and then via the ws whenever we receive the message of this stock then set the data to it
      const handleEvent = (message:any)=>{
 const res = JSON.parse(message.data);
        if( res.type === 'price-update' && res.data?.id === id){
            setData(res.data);
        }
        }
        const subscribe = ()=>{
            ws.send(JSON.stringify({
            type : "subscribe" , 
            stock : id 
        }));
        }
        ws.addEventListener("message" , handleEvent);
        ws.addEventListener("open", subscribe, { once: true });
        return ()=>{
            ws.removeEventListener("message", handleEvent);
            ws.removeEventListener("open", subscribe);
             if(ws.readyState === WebSocket.OPEN){
             ws.send(
            JSON.stringify({
                type: "unsubscribe",
                stock: id,
            })
        );}
        }
    } , [id , ws])
  return (
    <>
    {data && 
    // then show the data    
    <div>
        Name : {data.id}
        Price : {data.price}
        Change : {data.change}
        Change Percentage : {data.changePercent}
    <AdvancedRealTimeChart
    symbol={id}
    theme='dark'
    />
        </div>
    }
    </>
  )
}

export default Detail