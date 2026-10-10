  
import jwt, { type JwtPayload } from 'jsonwebtoken'
import User from '../models/User.js';
  import dotenv from 'dotenv'
import type { NextFunction , Request , Response} from 'express';


  dotenv.config();
  export async function authMiddleware(req:Request , res:Response , next:NextFunction){

    try {

       interface userPayload extends JwtPayload {
        userId : string
       };
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        const token = bearerToken ?? req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }
         const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );
        if (typeof decoded === "string" || typeof decoded.userId !== "string") {
    return res.status(401).json({ message: "Invalid token" });
         }


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