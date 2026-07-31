import { useEffect } from 'react'
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
function AuthLayout({ children, authentication = true }: { children: ReactNode; authentication?: boolean }) {
    const loading = useSelector((state : any) => state.auth.loading);
    const authStatus = useSelector((state : any) => state.auth.isLoggedIn);
    console.log("AuthLayout rendered");
    const navigate = useNavigate();
    useEffect(()=>{
          if(loading) return;
        if(authentication && authStatus !== authentication){
            navigate("/login")
        } else if(!authentication && authStatus !== authentication){
            navigate("/")
        } 
    } , [authentication, authStatus , navigate , loading]);
    
    if(loading){
        console.log("loading");
        return (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading...</p>
          </div>
        );
    }
       return <>{children}</>;
}

export default AuthLayout