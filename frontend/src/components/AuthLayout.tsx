import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
function AuthLayout({children,authentication=true}) {
    const loading = useSelector((state) => state.auth.loading);
    const authStatus = useSelector((state) => state.auth.isLoggedIn);
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