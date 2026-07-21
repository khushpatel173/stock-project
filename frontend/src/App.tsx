import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {login, logout , setLoading, updateBalance} from '../store/authSlice'
import authService from "./services/auth"
import type { IRootState  , AppDispatch} from "../store/store"
import WsContextProvider from "./contexts/WsContextProvider"
import { Outlet } from "react-router-dom"
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state : IRootState) => state.auth.loading);
  const getUser = async ()=>{
        try {
           const res = await authService.getCurrentUser();
      const user = res.user;
      if(!user){
        // that means not logged in so do nothing as that is also by default
        return null;
      }
      // else we have the user then just store that user in the store
      dispatch(login(user));
        } catch (error) {
          dispatch(logout());
        } finally{
          dispatch(setLoading());
        }
    }
  useEffect(()=>{
    // take the data about the user weather he is logged in or not and store it in the store
    getUser();
  } , [])

    if(loading){
      return (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading StockPulse...</p>
        </div>
      )
    }
  return (
   <> 
   <WsContextProvider>
    <Outlet/>
    </WsContextProvider>
   </>
  )
}

export default App
