import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import stockService from "../services/stock";
function Profile() {
    let user = useSelector((state:any) => state.auth.userData);
    const [transactions , setTransactions] = useState([]);

    useEffect(()=>{
      const getTransactions = async()=>{
        try {
          const response = await stockService.getTransactions();
          setTransactions(response.transactions);
           console.log(response.transactions);
        } catch (error) {
          console.log(error);
        }
      }
      getTransactions();
    } , [])
  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <span className="profile-page__label">Account</span>
        <h1 className="profile-page__title">Your Profile</h1>
        <button className="refresh-btn" onClick={()=>{
          window.location.reload();
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Refresh
        </button>
      </div>

      <div className="profile-page__content">
        <div className="profile-card">
          <div className="profile-card__avatar-section">
            {user.picture ? (
              <img className="profile-card__avatar" src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
            ) : (
              <div className="profile-card__avatar profile-card__avatar--placeholder">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="profile-card__user-info">
              <h2 className="profile-card__name">{user.name}</h2>
              <span className="profile-card__email">{user.email}</span>
            </div>
          </div>

          <div className="profile-card__divider"></div>

          <div className="profile-card__details">
            <div className="profile-card__detail-row">
              <div className="profile-card__detail-icon">👤</div>
              <div className="profile-card__detail-content">
                <span className="profile-card__detail-label">Full Name</span>
                <span className="profile-card__detail-value">{user.name}</span>
              </div>
            </div>
            <div className="profile-card__detail-row">
              <div className="profile-card__detail-icon">✉️</div>
              <div className="profile-card__detail-content">
                <span className="profile-card__detail-label">Email Address</span>
                <span className="profile-card__detail-value">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-balance-card">
          <div className="profile-balance-card__header">
            <div className="profile-balance-card__icon">💎</div>
            <span className="profile-balance-card__label">Available Balance</span>
          </div>
          <div className="profile-balance-card__amount">
            ${typeof user.balanceLeft === 'number' ? user.balanceLeft.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : user.balanceLeft}
          </div>
          <div className="profile-balance-card__subtitle">Ready to trade</div>
        </div>

        <div className="profile-transactions">
          <div className="profile-transactions__header">
            <h2 className="profile-transactions__title">Transaction History</h2>
          </div>
          
          {transactions.length > 0 ? (
            <div className="profile-transactions__list">
              {transactions.map((transaction:any, index) => {
                const isBuy = transaction.type.toLowerCase() === 'buy';
                const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                });
                
                return (
                  <div className="profile-transactions__item" key={transaction.createdAt || index}>
                    <div className={`profile-transactions__icon ${isBuy ? 'profile-transactions__icon--buy' : 'profile-transactions__icon--sell'}`}>
                      {isBuy ? '↓' : '↑'}
                    </div>
                    <div className="profile-transactions__info">
                      <span className="profile-transactions__type">{transaction.type}</span>
                      <span className="profile-transactions__date">{date}</span>
                    </div>
                    <div className={`profile-transactions__amount ${isBuy ? 'profile-transactions__amount--buy' : 'profile-transactions__amount--sell'}`}>
                      {isBuy ? '-' : '+'}${typeof transaction.amount === 'number' ? transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : transaction.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="profile-transactions__empty">
              No recent transactions to show.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile