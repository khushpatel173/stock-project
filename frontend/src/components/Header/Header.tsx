import Login from "./Login";
import LogoutBtn from "./LogoutBtn";
import { useSelector } from "react-redux";
import type { IRootState } from "../../../store/store";
function Header() {
    const userStatus = useSelector((state : IRootState) => state.auth.isLoggedIn);
  return (
    <div>
        {userStatus ? <>
        <LogoutBtn/>
        </> : <>
        <Login/>
        </>}
    </div>
  )
}

export default Header