    interface StockCardProps {
    id: string;
    price: number;
    change: number;
    changePercent: number;
}


function StockCard({price, change , changePercent , id}:StockCardProps) {


  return (
    <>
    <div>StockCard</div>    
    <p>Name : {id}</p>
    <p>Price : {price}</p>
    <p>Percentage Change : {changePercent}%</p>
    <p>Change : {change}</p>
    </>
  )
}

export default StockCard