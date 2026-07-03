import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {login, logout , setLoading} from '../store/authSlice'
import authService from "./services/auth"
import Detail from "./components/Detail"
import Header from "./components/Header/Header"
import type { IRootState  , AppDispatch} from "../store/store"
import Dashboard from "./components/Dashboard/Dashboard"
import Search from "./components/Search"
import WsContextProvider from "./contexts/WsContextProvider"
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
      return (<p>Loading....</p>)
    }
  return (
   <> 
   <WsContextProvider>
    <Detail/>
    </WsContextProvider>
   </>
  )
}

export default App
