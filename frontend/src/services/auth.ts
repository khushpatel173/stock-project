import axios from "axios";
import { authHeaders, captureAuthTokenFromUrl, clearAuthToken } from "./authToken";

const serverUrl = import.meta.env.VITE_SERVER_URL;

class AuthService{
    loginWithGoogle(){
        window.location.href =  `${serverUrl}/auth/google`;
    }
    captureLoginToken(){
        captureAuthTokenFromUrl();
    }
    async getCurrentUser(){
        const res = await axios.get(`${serverUrl}/profile` , {withCredentials : true, headers: authHeaders()});
        return res.data;   
    }
    async logout(){
        const res = await axios.get(`${serverUrl}/logout` , {withCredentials : true, headers: authHeaders()});
        clearAuthToken();
        return res.data;
    }
}

const authService = new AuthService;
export default authService;