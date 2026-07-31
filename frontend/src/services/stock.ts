import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;
// if ot is true then it is a limit order otherwise it is a market order
class StockService{
    async buy(stock:any , qty:any , reqPrice:any , limitPrice:any , orderType:any){
        console.log("Order Type" , orderType);
        const res = await axios.post(`${serverUrl}/buy/${stock}?qty=${qty}`,{reqPrice , limitPrice , orderType} , {withCredentials : true});
        return res.data;
    }
    async sell(stock:any , qty:any , reqPrice:any , limitPrice:any , orderType:any){
        const res = await axios.post(`${serverUrl}/sell/${stock}?qty=${qty}` , {reqPrice , limitPrice , orderType} , {withCredentials : true});
        return res.data;
    }
    async portfolio(){
        
        const res = await axios.get(`${serverUrl}/portfolio` , {withCredentials : true});        
        return res.data;
    }
    async getOrder(){
        // get all the orders from this user
        const res = await axios.get(`${serverUrl}/orders` , {withCredentials : true});
        return res.data;
    }
    async getTransactions(){
        const res = await axios.get(`${serverUrl}/transactions` , {withCredentials : true});
        return res.data;
    }
}

const stockService = new StockService();
export default stockService