
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
    <button onClick={onLogout}>Logout</button>
  )
}

export default LogoutBtn