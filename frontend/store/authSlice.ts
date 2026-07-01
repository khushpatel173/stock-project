import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn : false , 
    userData : null , 
    loading : true
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
        }
    }
})

export default authSlice.reducer
export const {login , logout , setLoading} = authSlice.actions