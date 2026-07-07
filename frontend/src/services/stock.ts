import axios from "axios";

class StockService{
    async buy(stock:any , qty:any){
        const res = await axios.get(`http://localhost:8080/buy/${stock}?qty=${qty}` , {withCredentials : true});
        return res.data;
    }
    async sell(stock:any , qty:any){
        const res = await axios.get(`http://localhost:8080/sell/${stock}?qty=${qty}` , {withCredentials : true});
        return res.data;
    }
    async portfolio(){
        const res = await axios.get('http://localhost:8080/portfolio' , {withCredentials : true});
        return res.data;
    }
}

const stockService = new StockService();
export default stockService