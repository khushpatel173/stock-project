import Order from "../models/Order.js";
import { orderType , status } from "../models/Order.js";


type orderDocument = InstanceType<typeof Order>;


        const map = new Map<string , number>(); // this is a subscription map 
        const priceMap = new Map<string , number>(); // this is a price map
        const orderBuy = new Map<string , orderDocument[]>();
        const orderSell = new Map<string , orderDocument[]>();

// as the server starts fetch the data from the backend if there is any
    const fetchPendingOrders = async() : Promise<void>=>{
        try {
             const orders = await Order.find({
            status : status.PENDING , 
        });
       for(const order of orders){
        if(order.type == orderType.BUY){

            const existingOrders = orderBuy.get(order.symbol);

            if(existingOrders){
                existingOrders.push(order);
            }
            else {
                orderBuy.set(order.symbol, [order]);
            }
        }
        else{

            const existingOrders = orderSell.get(order.symbol);

            if(existingOrders){
                existingOrders.push(order);
            }
            else {
                orderSell.set(order.symbol, [order]);
            }
        }
       }
        } catch (error) {
            throw new Error(`error: ${error}`)
        }
       
    }
 export {map , priceMap , orderBuy , orderSell , fetchPendingOrders}


//  what we can do is we can make this as a service and like add different functions which are doing things in map like adding a stock , removing a stock , getting a stock , etc.
