import axios from "axios";


// if ot is true then it is a limit order otherwise it is a market order
class StockService{
    async buy(stock:any , qty:any , reqPrice:any , limitPrice:any , orderType:any){
        console.log("Order Type" , orderType);
        const res = await axios.post(`http://localhost:8080/buy/${stock}?qty=${qty}`,{reqPrice , limitPrice , orderType} , {withCredentials : true});
        return res.data;
    }
    async sell(stock:any , qty:any , reqPrice:any , limitPrice:any , orderType:any){
        const res = await axios.post(`http://localhost:8080/sell/${stock}?qty=${qty}` , {reqPrice , limitPrice , orderType} , {withCredentials : true});
        return res.data;
    }
    async portfolio(){
        const res = await axios.get('http://localhost:8080/portfolio' , {withCredentials : true});
        return res.data;
    }
    async getOrder(userId:any){
        // get all the orders from this user
        const res = await axios.get(`http://localhost:8080/orders` , {withCredentials : true});
        return res.data;
    }
}

const stockService = new StockService();
export default stockService