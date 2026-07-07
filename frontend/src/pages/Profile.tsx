import { useSelector } from "react-redux"
import authService from "../services/auth"
function Profile() {
    const user = useSelector((state) => state.auth.userData);
    
  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <span className="profile-page__label">Account</span>
        <h1 className="profile-page__title">Your Profile</h1>
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
      </div>
    </div>
  )
}

export default Profile