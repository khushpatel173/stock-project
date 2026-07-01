import axios from "axios";

class AuthService{
    loginWithGoogle(){
        window.location.href =  "http://localhost:8080/auth/google";
    }
    async getCurrentUser(){
        const res = await axios.get("http://localhost:8080/profile" , {withCredentials : true});
        return res.data;   
    }
    async logout(){
        const res = await axios.get("http://localhost:8080/logout" , {withCredentials : true});
        return res.data;
    }
}

const authService = new AuthService;
export default authService;