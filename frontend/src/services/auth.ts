import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;

class AuthService{
    loginWithGoogle(){
        window.location.href =  `${serverUrl}/auth/google`;
    }
    async getCurrentUser(){
        const res = await axios.get(`${serverUrl}/profile` , {withCredentials : true});
        return res.data;   
    }
    async logout(){
        const res = await axios.get(`${serverUrl}/logout` , {withCredentials : true});
        return res.data;
    }
}

const authService = new AuthService;
export default authService;