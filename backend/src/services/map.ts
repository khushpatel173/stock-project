import Order from "../models/Order.js";


const map = new Map(); // this is a subscription map 
 const priceMap = new Map(); // this is a price map
const orderBuy = new Map();
const orderSell = new Map();

// as the server starts fetch the data from the backend if there is any
    const fetchPendingOrders = async()=>{
        try {
             const orders = await Order.find({
            status : "PENDING" , 
        });
       for(const order of orders){
        if(order.type == "BUY"){
                if(!orderBuy.has(order.symbol)){
           orderBuy.set(order.symbol , []);
        }
            orderBuy.get(order.symbol).push(order);
        }
        else{
            if(!orderSell.has(order.symbol)){
           orderSell.set(order.symbol , []);
        }
            orderSell.get(order.symbol).push(order);
        }
       }
        } catch (error) {
            throw new Error(`error: ${error}`)
        }
       
    }
 export {map , priceMap , orderBuy , orderSell , fetchPendingOrders}


//  what we can do is we can make this as a service and like add different functions which are doing things in map like adding a stock , removing a stock , getting a stock , etc.
