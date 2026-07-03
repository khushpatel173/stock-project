
import LogoutBtn from "./LogoutBtn";
import { useSelector } from "react-redux";
import type { IRootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
    const userStatus = useSelector((state : IRootState) => state.auth.isLoggedIn);
  return (
    <div>

        <button onClick={()=>{navigate("/dashboard")}}>Dashboard</button>
         <button onClick={()=>{navigate("/search")}}>Search</button>
         <button onClick={()=>{navigate("/")}}>Home</button>
        {userStatus ? <>
        <LogoutBtn/>
        </> : <>
        <button onClick={()=>{navigate("/login")}}>Login</button>
        </>}
    </div>
  )
}

export default Header