  
import jwt from 'jsonwebtoken'
import User from '../models/User.js';
  
  export async function authMiddleware(req , res , next){

    try {
        const token = req.cookies.token;
   if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }
         const decoded : any = jwt.verify(
            token,
            "secret"
        );
        const user = await User.findById(decoded.userId);
        if(!user){
             return res.status(404).json({
                message: "User not found"
            });
        }

        //  now we have got the user
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
      
  }