
import LogoutBtn from "./LogoutBtn";
import { useSelector } from "react-redux";
import type { IRootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
    const userStatus = useSelector((state : IRootState) => state.auth.isLoggedIn);
  return (
    <header className="header">
      <div className="header__logo" onClick={()=>{navigate("/")}}>📈 StockPulse</div>
      <nav className="header__nav">
        <button className="header__nav-link" onClick={()=>{navigate("/")}}>Home</button>
        <button className="header__nav-link" onClick={()=>{navigate("/dashboard")}}>Dashboard</button>
        <button className="header__nav-link" onClick={()=>{navigate("/search")}}>Search</button>
        <button className="header__nav-link" onClick={()=>{navigate("/portfolio")}}>Portfolio</button>
        <button className="header__nav-link" onClick={()=>{navigate("/profile")}}>Profile</button>
        <button className="header__nav-link" onClick={()=>{navigate("/orders")}}>Orders</button>
      </nav>
      <div className="header__auth">
        {userStatus ? <LogoutBtn/> : <button className="header__auth-btn header__auth-btn--login" onClick={()=>{navigate("/login")}}>Sign In</button>}
      </div>
    </header>
  )
}

export default Header