import express from 'express';
import passport from 'passport';
import { Strategy} from 'passport-google-oauth20';
import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import "dotenv/config";
import WebSocket from 'ws';
import {WebSocketServer} from 'ws'
import protobuf from 'protobufjs'
import http from 'http'
const app = express();
 const map = new Map();
   const server = http.createServer(app);

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
        let user : any = await User.findOne({
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

server.listen(8080 , ()=>{
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

app.get("/getStocks/:stock" , async(req ,res)=>{
     const {stock} = req.params;    
    //  now search for this stock
    const response = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${stock}`);
    const ans = await response.json();
    const requiredStocks = ans.quotes.filter((stock:any) => (stock.symbol.endsWith(".BO") || stock.symbol.endsWith(".NS")));
    res.json({
        stockData : requiredStocks
    });
})
// if done then kaha jana he and then if fails then kaha jana he



    const ws = new WebSocket("wss://streamer.finance.yahoo.com/?version=2");
 

    const ws2 = new WebSocketServer({
        server
    });

    ws.on("open" , async()=>{
       
        console.log("Socket Connected!");
        // ws.send(JSON.stringify(
        //     {
        //        subscribe: [
        //     // "^NSEI",
        //     // "^NSEBANK",
        //     // "^BSESN",
           
        //     // "TCS.NS"
        // ]
        //     } 
        // ))
        console.log("Subscribed!");
        const root = await protobuf.load("protobuf/PricingData.proto")
        const PricingData = root.lookupType("PricingData");

        ws.on("message", (message) => {
        // console.log(typeof message);
        const parsed = JSON.parse(message.toString());
        const buffer = Buffer.from(parsed.message, "base64");
        const decoded = PricingData.decode(buffer);
        console.log(decoded);
        map.set(decoded.id , decoded);
        // add the data to the hashmap
        //  now we will send this data to the frontend and for tht also we wll use a websocket

            

        // send the decoded data to all the connected clients 
        ws2.clients.forEach((client)=> {
             if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
            type : "price-update" , 
            data : decoded
        }));
    }
        })

    });



    ws.on("close", () => {
        console.log("Closed");
    });

    ws.on("error", (err) => {
        console.error(err);
    });
    })
    ws2.on("connection" , (client)=>{
        client.on("message" , (message : any)=>{
            const parsed = JSON.parse(message.toString());            
            // client have sent a message that i need info of this particular stck
            if(parsed.type === "subscribe"){
                // if the stock is not in the hashmaps then subscribe to it , add it to the hashmaps
            if(map.has(parsed.stock)){
                // if it have it in the map then it is already subsctibed and we are already getting the data about it
                return;
            }
            // now if it does not have it , then just subscribe to it
                    ws.send(
            JSON.stringify({
                subscribe: [`${parsed.stock}`]
            })
);
            }   
            // add about unsubsribe
        })
    })

