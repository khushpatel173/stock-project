// import express from 'express';
// import passport from 'passport';
// import Port from './models/Port.js';
// import { Strategy} from 'passport-google-oauth20';
// import mongoose from 'mongoose';
// import User from './models/User.js';
// import jwt from 'jsonwebtoken'
// import cookieParser from 'cookie-parser'
// import cors from 'cors'
// import "dotenv/config";
// import WebSocket from 'ws';
// import {WebSocketServer} from 'ws'
// import protobuf from 'protobufjs'
// import http from 'http'


// const app = express();
//  const map = new Map();
//  const priceMap = new Map();
//    const server = http.createServer(app);

// app.use(express.json());
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true 
// }));
// app.use(cookieParser());
// const dbUrl = "mongodb://127.0.0.1:27017/trading-app";
// main().then(()=>{
//     console.log("connection successful");
// }).catch((err)=>{
//     console.log(err);
// })
// async function main(){
//    await mongoose.connect(dbUrl);
// }

// app.use(passport.initialize());
// passport.use(new Strategy({
//     clientID : process.env.CLIENT_ID! , 
//     clientSecret: process.env.CLIENT_SECRET!,
//     callbackURL: 'http://localhost:8080/auth/google/callback'
// } , async (accessToken , refreshToken , profile , done)=> {
//     // what happens after login
//     // check if the user is there in the db if he is not then add him to the db

//     const email = profile.emails?.[0]?.value;
// const picture = profile.photos?.[0]?.value;
// if (!email) {
//     return done(new Error("Google account has no email"));
// }
//     try {
//         let user : any = await User.findOne({
//         email : email
//     });

//      if (!user) {
//        user = await User.create({
//     googleId: profile.id,
//     name: profile.displayName,
//     email,
//     picture: picture ?? "",
// });
//     }

//     done(null, user);
//     } catch (error) {
//          done(error as Error);
//     }
    
// }));

// server.listen(8080 , ()=>{
//     console.log("Server listening to port 8080");
// });

// // auth routesss

// app.get("/auth/google" , passport.authenticate("google" , {
//     scope :["profile" , "email"] ,
//     session:false
// }));
// app.get(
//     "/auth/google/callback",
//     passport.authenticate("google", {
//         session: false,
//         failureRedirect : "http://localhost:5173/"
//     }),
//     async(req, res) => {
//         // now the user is logged in so add the jwt

//         // make a portfolio and add the user 
//     // const portfolio = new Port({
//     //         owner : req.user?._id
//     // });
//     // await portfolio.save();

//     let portfolio = await Port.findOne({
//         owner : req.user?._id
//     });
//     if(!portfolio){
//         portfolio =  new Port({
//             owner : req.user?._id , 
//             stocks : [],
//     });
//     await portfolio.save();
//     }
//     const user = await User.findById(req.user?._id);
//     await user?.updateOne({
//         portfolio : portfolio._id
//     });
//      const token = jwt.sign({
//         userId : req.user?._id
//      } , "secret" , {
//         expiresIn : "1d"
//      });
//      res.cookie("token" , token , {
//             httpOnly : true
//         });
//         res.redirect("http://localhost:5173/");
//     }
// );

// app.get("/profile" , async(req ,res)=>{
//     // return the user according to the cookie if not then error
//     try {
//         const token = req.cookies.token;
//    if (!token) {
//             return res.status(401).json({
//                 message: "Not authenticated"
//             });
//         }
//          const decoded : any = jwt.verify(
//             token,
//             "secret"
//         );
//         const user = await User.findById(decoded.userId);
//         if(!user){
//              return res.status(404).json({
//                 message: "User not found"
//             });
//         }
//         res.json({
//             user
//         });
//     } catch (error) {
//          res.status(401).json({
//             message: "Invalid token"
//         });
//     }
    

// })
// app.get("/logout" , (req ,res)=>{
//     res.clearCookie("token" , {
//         httpOnly : true
//     })
//      res.json({
//         message: "Logged out successfully"
//     });
// });

// app.get("/getStocks/:stock" , async(req ,res)=>{
//      const {stock} = req.params;    
//     //  now search for this stock
//     const response = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${stock}`);
//     const ans = await response.json();
//     // const requiredStocks = ans.quotes.filter((stock:any) => (stock.symbol.endsWith(".BO") || stock.symbol.endsWith(".NS")));
//     const requiredStocks = ans.quotes;
//     res.json({
//         stockData : requiredStocks
//     });
// })

// app.get("/history/:stock" ,async(req ,res)=>{
//     const {stock} = req.params;
//     const{range , interval} = req.query;
//     const ans = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stock}?range=${range}&interval=${interval}`);
//     const response = await ans.json();
//     const data = response.chart.result[0].indicators.quote[0];
//     if(!data.open){
//         return res.status(401).json({
//             message : "There is no enough data available"
//         });
//     } 
//     const timeData = response.chart.result[0].timestamp;
//     const updatedData = [];
//     for(let i = 0; i < data['open'].length;i++){
//         if (
//     timeData[i] == null ||         
//     data.open[i] == null ||
//     data.high[i] == null ||
//     data.low[i] == null ||
//     data.close[i] == null
// ) {
//     continue;
// }
//          const candleTime = Math.floor(timeData[i] / 60) * 60;
//         updatedData.push({
//             time: candleTime + 19800,
//             open: data['open'][i],
//             high: data['high'][i],
//             volume: data['volume'][i], 
//             low: data['low'][i],
//             close: data['close'][i] 
//         });
//     }
//     // give me the last candle
//     console.log(updatedData[updatedData.length-1]);
    
//     res.json({historyData : updatedData , 
//         lastCandle : updatedData[updatedData.length-1]
//     });
// })

// app.get("/buy/:stock" , async(req ,res)=>{
//     const {stock} = req.params;
//     const {qty} = req.query;
//     // now we need the latest price of the stocks
//     const price = priceMap.get(stock);
//     if(!price){ // that means no stock is found that means no live data
//         return res.status(404).json({
//         message: "No live data available for this stock",
//     });
//     }
//     // now check if the user have enough balance to buy the stock

//         try {
//             const token = req.cookies.token;
//    if (!token) {
//             return res.status(401).json({
//                 message: "Not authenticated"
//             });
//         }
//          const decoded : any = jwt.verify(
//             token,
//             "secret"
//         );
//         const user = await User.findById(decoded.userId);
//         if(!user){
//              return res.status(404).json({
//                 message: "User not found"
//             });
//         }
//         // now we have the user as well so check its balance
//         const userBalance = user.balanceLeft;
//         if(userBalance < Number(qty) * price){
//             // insuffiecient balance
//             return res.status(404).json({
//                 message: "Insufficient Balance"
//             });
//         }

//         // now the user have balance also the user exist also and also we have the live price of the stock then make the purchase

//         // add the stock to the portfolio and reduce the balance
//           const portfolio = await Port.findOne({
//             owner : user._id
//         });
//         if(!portfolio){
//             return res.status(404).json({
//                 message: "Portfolio Not Found"
//             });
//         }
//         user.balanceLeft = userBalance - (Number(qty) * price);
//         await user.save();
//         // then add this to portfolio

//     //    portfolio.stocks.push({
//     //             name : stock , 
//     //             qty : Number(qty) , 
//     //             buy : price ,
//     //             purchasedDate : new Date()
//     //         });
//         const index = portfolio.stocks.findIndex(obj => obj.name == stock);
//         if(index == -1){
//             // then this stock is not there just push
//                portfolio.stocks.push({
//                 name : stock , 
//                 qty : Number(qty) , 
//                 buy : price ,
//                 purchasedDate : new Date()
//             });
//         }else{
//             const holding = portfolio.stocks[index];
//             const oldQty = holding?.qty;
//             const oldAvg = holding?.buy;
//             const newAvg = ((oldQty! * oldAvg!) + (Number(qty) * price))/(Number(qty) + oldQty!);
//             portfolio.stocks[index] = {
//                 name : stock , 
//                 qty : oldQty! + Number(qty),
//                 buy : newAvg , 
//                 purchasedDate : new Date()
//             }
//         }
//         // that means it already have that then we need to change the avg price and qty

    
//             await portfolio.save();
//             // now the order has been placeddd
//             res.status(201).json({
//                 message : "Order places successfully" , 
//                 orderedPrice : price , 
//                 orderedQty : Number(qty) , 
//                 user : user
//             });
//         } catch (error) {
//             return res.status(401).json({
//                 message : "Some error"
//             })}
// })

// app.get("/sell/:stock" , async(req ,res)=>{
//     const {stock} = req.params;
//     const {qty} = req.query;
//     // now we need the latest price of the stocks
//     const price = priceMap.get(stock);
//     if(!price){ // that means no stock is found that means no live data
//         return res.status(404).json({
//         message: "No live data available for this stock",
//     });
//     }
//     // now check if the user have enough balance to buy the stock

//         try {
//             const token = req.cookies.token;
//    if (!token) {
//             return res.status(401).json({
//                 message: "Not authenticated"
//             });
//         }
//          const decoded : any = jwt.verify(
//             token,
//             "secret"
//         );
//         const user = await User.findById(decoded.userId);
//         if(!user){
//              return res.status(404).json({
//                 message: "User not found"
//             });
//         }
//         // now we have the user as well so check its balance
//         const userBalance = user.balanceLeft;
//         // now the user have balance also the user exist also and also we have the live price of the stock then make the purchase

//         // add the stock to the portfolio and reduce the balance
//           const portfolio = await Port.findOne({
//             owner : user._id
//         });
//         if(!portfolio){
//             return res.status(404).json({
//                 message: "Portfolio Not Found"
//             });
//         }

        
//     //    portfolio.stocks.push({
//     //             name : stock , 
//     //             qty : Number(qty) , 
//     //             buy : price ,
//     //             purchasedDate : new Date()
//     //         });
//     const index = portfolio.stocks.findIndex(obj => obj.name == stock);
//     if(index == -1){
//         // that means we dont have this stock
//         return res.status(401).json({
//                 message : "You dont have this stock"
//             })}
//             // that means we have this stock now check if we have enought qty
//             if(Number(qty) > portfolio.stocks[index].qty){
//                 return res.status(401).json({
//                 message : "You dont have enough quantity of this stock"
//             })
//             }

//             // now you have enought qty so you can sell
//             // we will dec the qty of the stock and if the qty becomes zero we will remove it
//             const oldQty = portfolio.stocks[index]?.qty;
//             const oldPrice = portfolio.stocks[index]?.buy;
//             portfolio.stocks[index] = {
//                 name : stock , 
//                 qty : oldQty - Number(qty),
//                 buy : oldPrice , 
//                 purchasedDate : portfolio.stocks[index]?.purchasedDate
//             };

//             if(portfolio.stocks[index]?.qty == 0){
//                 portfolio.stocks.splice(index , 1);
//             }
//             await portfolio.save();
            
//             user.balanceLeft = userBalance + (Number(qty) * price);
//             await user.save();
//         //     await user.updateOne({
//         //     balanceLeft : userBalance + (Number(qty) * price)
//         // }); dont do this otherwise the user will not update whih we passing it only updates in the db
//             // now the order has been placeddd
            
//             res.status(201).json({
//                 message : "Stock Sold successfully" , 
//                 soldPrice : price , 
//                 soldQty : Number(qty) , 
//                 user : user
//             })
//         } catch (error) {
//             return res.status(401).json({
//                 message : "Some error"
//             })}
// })

// app.get("/portfolio" , async(req ,res)=>{
//     // take the logged in user and give the portfolio

//       const token = req.cookies.token;
//    if (!token) {
//             return res.status(401).json({
//                 message: "Not authenticated"
//             });
//         }
//          const decoded : any = jwt.verify(
//             token,
//             "secret"
//         );
//         const user = await User.findById(decoded.userId);
//         if(!user){
//              return res.status(404).json({
//                 message: "User not found"
//             });
//         }
//         // fetch the portfolio of the user
//         const portfolio = await Port.findById(user.portfolio);
//         if(!portfolio){
//              return res.status(404).json({
//                 message: "PortFolio cant be fetched"
//             });
//         }
//        res.status(201).json({
//         portfolio : portfolio
//        });

// })
// // if done then kaha jana he and then if fails then kaha jana he
// // app.get("/test" , async(req , res)=>{
// //     const response = await fetch("https://query1.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS,TCS.NS", {
// //     headers: {
// //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
// //     }
// // });
// // const data = await response.json();
// //     res.json({data});

// // })


//     const ws = new WebSocket("wss://streamer.finance.yahoo.com/?version=2");
 

//     const ws2 = new WebSocketServer({
//         server
//     });

//     ws.on("open" , async()=>{
       
//         console.log("Socket Connected!");
//         console.log("Subscribed!");
//         const root = await protobuf.load("protobuf/PricingData.proto")
//         const PricingData = root.lookupType("PricingData");

//         ws.on("message", (message) => {
//         // console.log(typeof message);
//         const parsed = JSON.parse(message.toString());
//         const buffer = Buffer.from(parsed.message, "base64");
//         const decoded = PricingData.decode(buffer);
//         console.log(decoded);
//         priceMap.set(decoded.id , decoded.price);
//         // console.log(decoded.time.toNumber());
//         // add the data to the hashmap
//         //  now we will send this data to the frontend and for tht also we wll use a websocket
//         // send the decoded data to all the connected clients 
//         ws2.clients.forEach((client)=> {
//              if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({
//             type : "price-update" , 
//             data : decoded
//         }));
//     }
//         })

//     });



//     ws.on("close", () => {
//         console.log("Closed");
//     });

//     ws.on("error", (err) => {
//         console.error(err);
//     });
//     })
//     ws2.on("connection" , (client)=>{
//         client.on("message" , (message : any)=>{
//             const parsed = JSON.parse(message.toString());  
//             // console.log(parsed);  
//             // client have sent a message that i need info of this particular stck
//             if(parsed.type === "subscribe"){
//                 parsed.stock.map((stock , index) => {
//                       if(map.has(stock)){
//                          map.set(stock , map.get(stock) + 1);
//                         return stock;
//                     }
//                         if (ws.readyState === WebSocket.OPEN) {
//                              map.set(stock ,1);
//     ws.send(
//         JSON.stringify({
//             subscribe: [stock],
//         })
//     );
// }  
//                     return stock;
//                 })
//         } 
//             // add about unsubsribe
//             else if(parsed.type === 'unsubscribe'){
//                 console.log("Before" , map);
//                 parsed.stock.map((stock , index) =>{
//                     if(map.has(stock)){
//                         map.set(stock , map.get(stock) - 1);
//                     }
//                      if(!map.has(stock) || map.get(stock) > 0){
//                 // then dont unsubscribe
//                 return stock;
//             }
//             if (ws.readyState === WebSocket.OPEN) {
//                 map.delete(stock);
//                 priceMap.delete(stock);
//     ws.send(
//         JSON.stringify({
//             unsubscribe: [stock],
//         })
//     );
// }
//                     return stock;
//                 })
//                 console.log("Before" , map);
                
//             }
//         })
//     })

