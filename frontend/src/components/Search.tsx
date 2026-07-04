import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
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
                console.log(res.data.stockData);
                
                setStocks(res.data.stockData);
            
            } catch (error) {
                console.log(error);
            }
        
           
        } , 300);
        return ()=> clearTimeout(timer);

    } , [search])
  return (
    <div className="search-page">
      <div className="search-page__header">
        <h1 className="search-page__title">Search Stocks</h1>
        <p className="search-page__subtitle">Find any stock, ETF, or cryptocurrency</p>
      </div>
      <div className="search-input-wrapper">
        <span className="search-input-wrapper__icon">🔍</span>
        <input className="search-input" type="text" placeholder="Search by name or symbol..." value={search} onChange={(e)=>{ setSearch(e.target.value); }}/>
      </div>
      <ul className="search-results">
        {stocks.map((stock:any) => (
          <Link to={`/${stock.symbol}`} key={stock.symbol} className="search-result-item">
            <div className="search-result-item__info">
              <span className="search-result-item__name">{stock.shortname}</span>
              <span className="search-result-item__symbol">{stock.symbol}</span>
            </div>
            <div className="search-result-item__meta">
              <span className="search-result-item__exchange">{stock.exchange}</span>
              <span className="search-result-item__arrow">→</span>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default Search