import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn : false , 
    userData : null , 
    loading : true , 
    balance : 0
}

const authSlice = createSlice({
    name : 'auth' , 
    initialState , 
    reducers : {
        login : (state , action) =>{
            state.userData = action.payload , 
            state.isLoggedIn = true
        } , 
        logout : (state) =>{
            state.isLoggedIn = false
            state.userData = null
        } , 
         setLoading : (state)=>{
            state.loading = false;
        } , 
        buy : (state , action)=>{
            state.balance = state.balance - action.payload.amount;
        } , 
        sell : (state , action)=>{
            state.balance = state.balance + action.payload.amount
        }
    }
})

export default authSlice.reducer
export const {login , logout , setLoading , buy ,sell} = authSlice.actions