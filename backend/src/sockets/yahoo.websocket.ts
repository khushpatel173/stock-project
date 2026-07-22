
import WebSocket from 'ws';
import {WebSocketServer} from 'ws'
import protobuf from 'protobufjs'
import { map  , priceMap} from '../services/map.js';
import { orderBuy , orderSell } from '../services/map.js';
import { buyStock, purchaseStock, soldStock } from '../services/order.services.js';
export const ws = new WebSocket("wss://streamer.finance.yahoo.com/?version=2");
export function initWebSocket (server:any){
       
        const ws2 = new WebSocketServer({
            server
        });
    
        ws.on("open" , async()=>{
           
            console.log("Socket Connected!");
            console.log("Subscribed!");
            const root = await protobuf.load("protobuf/PricingData.proto")
            const PricingData = root.lookupType("PricingData");
    
            ws.on("message", async(message) => {
            // console.log(typeof message);
            const parsed = JSON.parse(message.toString());
            const buffer = Buffer.from(parsed.message, "base64");
            const decoded = PricingData.decode(buffer);
            console.log(decoded);
            priceMap.set(decoded.id , decoded.price);

            // check if there are any orders for this stocks and if there are then execute them if you can
                    if (orderBuy.has(decoded.id)) {
                        const orders = orderBuy.get(decoded.id);
                        const remainingOrders = [];

                            for (const order of orders) {
                                if (order.requestedPrice >= decoded.price) {
                                    await purchaseStock(
                                        order.user,
                                        decoded.id,
                                        order.qty,
                                        decoded.price,
                                        order
                                    );
                                    // unsubscribe or decrease the count as the order is complete so no need to make sure
                                     if(map.has(decoded.id)){
                            map.set(decoded.id , map.get(decoded.id) - 1);
                        }
                         if(!map.has(decoded.id) || map.get(decoded.id) > 0){
                    // then dont unsubscribe
                }
                else{
  if (ws.readyState === WebSocket.OPEN) {
                    map.delete(decoded.id);
                    priceMap.delete(decoded.id);
        ws.send(
            JSON.stringify({
                unsubscribe: [decoded.id],
            })
        );
    }
                }
              
                                } else {
                                    remainingOrders.push(order);
                                }
                            }
            orderBuy.set(decoded.id, remainingOrders);
        }
               if (orderSell.has(decoded.id)) {
                        const orders = orderSell.get(decoded.id);
                        const remainingOrders = [];

                            for (const order of orders) {
                                if (order.requestedPrice <= decoded.price) {
                                    await soldStock(
                                        order.user,
                                        decoded.id,
                                        order.qty,
                                        decoded.price,
                                        order
                                    );

                                       if(map.has(decoded.id)){
                            map.set(decoded.id , map.get(decoded.id) - 1);
                        }
                         if(!map.has(decoded.id) || map.get(decoded.id) > 0){
                    // then dont unsubscribe
                }
                else{
  if (ws.readyState === WebSocket.OPEN) {
                    map.delete(decoded.id);
                    priceMap.delete(decoded.id);
        ws.send(
            JSON.stringify({
                unsubscribe: [decoded.id],
            })
        );
    }
                }
                                } else {
                                    remainingOrders.push(order);
                                }
                            }
            orderSell.set(decoded.id, remainingOrders);
        }

            // setPrice(decoded.id , decoded.price);
            // console.log(decoded.time.toNumber());
            // add the data to the hashmap
            //  now we will send this data to the frontend and for tht also we wll use a websocket
            // send the decoded data to all the connected clients 
            ws2.clients.forEach((client)=> {
                 if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type : "price-update" , 
                data : decoded
            }));
        }
            })
    
        });
    
    
    
        ws.on("close", () => {
            console.log("Closed");
        });
    
        ws.on("error", (err) => {
            console.error(err);
        });
        })
        ws2.on("connection" , (client)=>{
            client.on("message" , (message : any)=>{
                const parsed = JSON.parse(message.toString());  
                // console.log(parsed);  
                // client have sent a message that i need info of this particular stck
                if(parsed.type === "subscribe"){
                    parsed.stock.map((stock , index) => {
                          if(map.has(stock)){
                             map.set(stock , map.get(stock) + 1);
                            return stock;
                        }
                            if (ws.readyState === WebSocket.OPEN) {
                                 map.set(stock ,1);
        ws.send(
            JSON.stringify({
                subscribe: [stock],
            })
        );
    }  
                        return stock;
                    })
            } 
                // add about unsubsribe
                else if(parsed.type === 'unsubscribe'){
                    console.log("Before" , map);
                    parsed.stock.map((stock,index) =>{
                        if(map.has(stock)){
                            map.set(stock , map.get(stock) - 1);
                        }
                         if(!map.has(stock) || map.get(stock) > 0){
                    // then dont unsubscribe
                    return stock;
                }
                if (ws.readyState === WebSocket.OPEN) {
                    map.delete(stock);
                    priceMap.delete(stock);
        ws.send(
            JSON.stringify({
                unsubscribe: [stock],
            })
        );
    }
                        return stock;
                    })
                    console.log("Before" , map);
                    
                }
            })
        })
}

