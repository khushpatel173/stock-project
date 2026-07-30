import axios from "axios";

class AuthService{
    loginWithGoogle(){
        window.location.href =  "https://stockify-kmw5.onrender.com/auth/google";
    }
    async getCurrentUser(){
        const res = await axios.get("https://stockify-kmw5.onrender.com/profile" , {withCredentials : true});
        return res.data;   
    }
    async logout(){
        const res = await axios.get("https://stockify-kmw5.onrender.com/logout" , {withCredentials : true});
        return res.data;
    }
}

const authService = new AuthService;
export default authService;