
import authService from '../../services/auth'
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice"
function LogoutBtn() {
    const dispatch = useDispatch();
    const onLogout = async()=>{
        const res = await authService.logout();
        dispatch(logout());
    }
  return (
    <button className="header__auth-btn header__auth-btn--logout" onClick={onLogout}>Logout</button>
  )
}

export default LogoutBtn