    interface StockCardProps {
    id: string;
    price: number;
    change: number;
    changePercent: number;
}


function StockCard({price, change , changePercent , id}:StockCardProps) {


  return (
    <div className="stock-card">
      <div className="stock-card__header">
        <span className="stock-card__symbol">{id}</span>
        <span className={`stock-card__badge ${changePercent >= 0 ? 'stock-card__badge--positive' : 'stock-card__badge--negative'}`}>
          {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
        </span>
      </div>
      <div className="stock-card__price">${typeof price === 'number' ? price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : price}</div>
      <div className={`stock-card__change ${change >= 0 ? 'stock-card__change--positive' : 'stock-card__change--negative'}`}>
        {change >= 0 ? '↑' : '↓'} {typeof change === 'number' ? Math.abs(change).toFixed(2) : change}
      </div>
    </div>
  )
}

export default StockCard