import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { IRootState } from '../../store/store'

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: IRootState) => state.auth.isLoggedIn);
  return (
    <div className="landing">
      <div className="landing__hero">
        <div className="landing__badge">⚡ Real-Time Data</div>
        <h1 className="landing__title">
          Track Markets in <span>Real Time</span>
        </h1>
        <p className="landing__subtitle">
          Monitor live cryptocurrency and stock prices with interactive candlestick charts, instant search, and real-time WebSocket updates.
        </p>
        <div className="landing__cta-group">
          {isLoggedIn ? (
            <button className="landing__cta landing__cta--primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          ) : (
            <>
              <button className="landing__cta landing__cta--primary" onClick={() => navigate('/login')}>Get Started</button>
              <button className="landing__cta landing__cta--secondary" onClick={() => navigate('/dashboard')}>View Dashboard</button>
            </>
          )}
        </div>
        <div className="landing__features">
          <div className="landing__feature-card">
            <div className="landing__feature-icon" style={{backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6'}}>📊</div>
            <h3 className="landing__feature-title">Live Charts</h3>
            <p className="landing__feature-desc">Interactive candlestick charts with real-time price updates via WebSocket connections.</p>
          </div>
          <div className="landing__feature-card">
            <div className="landing__feature-icon" style={{backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981'}}>🔍</div>
            <h3 className="landing__feature-title">Instant Search</h3>
            <p className="landing__feature-desc">Search thousands of stocks, ETFs, and cryptocurrencies with lightning-fast results.</p>
          </div>
          <div className="landing__feature-card">
            <div className="landing__feature-icon" style={{backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b'}}>⚡</div>
            <h3 className="landing__feature-title">Real-Time Data</h3>
            <p className="landing__feature-desc">Get instant price updates powered by WebSocket technology for zero-delay monitoring.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home