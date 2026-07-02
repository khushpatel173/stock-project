import axios from "axios";
import { useEffect, useState } from "react"
function Search() {
    const[search , setSearch] = useState("");
    const[stocks , setStocks] = useState([]);
    useEffect(()=>{
        // whenever the search changes we will get the data from the backend and dispaly in the lists
        if (!search.trim()) {
             setStocks([]);

            return};

        const timer = setTimeout(async()=>{
            try {
                    // this will run if the user have not typed anything in 300ms
            const res = await axios.get(`http://localhost:8080/getStocks/${search}`);
            // res.data will give you the data
            
                setStocks(res.data.stockData);
            
            } catch (error) {
                console.log(error);
            }
        
           
        } , 300);
        return ()=> clearTimeout(timer);

    } , [search])
  return (
    <>
    <input type="text" placeholder="Enter stock name" value={search} onChange={(e)=>{
        setSearch(e.target.value);
    }}/>
    <ul>
        {stocks.map((stock:any) => (
            <li key={stock.symbol}> {stock.shortname} |||  {stock.symbol} ||| {stock.exchange} </li>
        ))}
        </ul> 
    </>
  )
}

export default Search