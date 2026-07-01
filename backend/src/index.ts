import express from 'express';
import passport from 'passport';
import { Strategy} from 'passport-google-oauth20';
import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import "dotenv/config";
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));
app.use(cookieParser());
const dbUrl = "mongodb://127.0.0.1:27017/trading-app";
main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})
async function main(){
   await mongoose.connect(dbUrl);
}

app.use(passport.initialize());
passport.use(new Strategy({
    clientID : process.env.CLIENT_ID! , 
    clientSecret: process.env.CLIENT_SECRET!,
    callbackURL: 'http://localhost:8080/auth/google/callback'
} , async (accessToken , refreshToken , profile , done)=> {
    // what happens after login
    // check if the user is there in the db if he is not then add him to the db
    try {
        let user = await User.findOne({
        googleId : profile.id
    });
    const email = profile.emails?.[0]?.value;
const picture = profile.photos?.[0]?.value;
if (!email) {
    return done(new Error("Google account has no email"));
}
     if (!user) {
       user = await User.create({
    googleId: profile.id,
    name: profile.displayName,
    email,
    picture: picture ?? "",
});
    }
    done(null, user);
    } catch (error) {
         done(error as Error);
    }
    
}));

app.listen(8080 , ()=>{
    console.log("Server listening to port 8080");
});

app.get("/" , (req, res)=>{
    res.send("Hello!!");
})

// auth routesss

app.get("/auth/google" , passport.authenticate("google" , {
    scope :["profile" , "email"] ,
    session:false
}));
app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect : "http://localhost:5173/"
    }),
    (req, res) => {
        // now the user is logged in so add the jwt
     const token = jwt.sign({
        userId : req.user?._id
     } , "secret" , {
        expiresIn : "1d"
     });
     res.cookie("token" , token , {
            httpOnly : true
        });
        res.redirect("http://localhost:5173/");
    }
);

app.get("/profile" , async(req ,res)=>{
    // return the user according to the cookie if not then error
    try {
        const token = req.cookies.token;
   if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }
         const decoded = jwt.verify(
            token,
            "secret"
        );
        const user = await User.findById(decoded.userId);
        if(!user){
             return res.status(404).json({
                message: "User not found"
            });
        }
        res.json({
            user
        });
    } catch (error) {
         res.status(401).json({
            message: "Invalid token"
        });
    }
    

})
app.get("/logout" , (req ,res)=>{
    res.clearCookie("token" , {
        httpOnly : true
    })
     res.json({
        message: "Logged out successfully"
    });
});


// if done then kaha jana he and then if fails then kaha jana he