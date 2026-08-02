  
import jwt from 'jsonwebtoken'
import User from '../models/User.js';
  import dotenv from 'dotenv'


  dotenv.config();
  export async function authMiddleware(req:any , res:any , next:any){

    try {
        console.log(req.cookies);
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }
         const decoded : any = jwt.verify(
            token,
            process.env.JWT_SECRET!
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