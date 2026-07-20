import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from './config/passport.js';
import Port from './models/Port.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken'
import { priceMap } from './services/map.js';
import { authMiddleware } from './middleware/auth.js';
import { time } from 'console';

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));
app.use(cookieParser());
app.use(passport.initialize());

// all routessssss

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
    async(req, res) => {
        // now the user is logged in so add the jwt

        // make a portfolio and add the user 
    // const portfolio = new Port({
    //         owner : req.user?._id
    // });
    // await portfolio.save();

    let portfolio = await Port.findOne({
        owner : req.user?._id
    });
    if(!portfolio){
        portfolio =  new Port({
            owner : req.user?._id , 
            stocks : [],
    });
    await portfolio.save();
    }
    const user = await User.findById(req.user?._id);
    await user?.updateOne({
        portfolio : portfolio._id
    });
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

app.get("/profile", authMiddleware, async(req ,res)=>{
    // return the user according to the cookie if not then error
    try {
        const user = req.user;
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
    // const requiredStocks = ans.quotes.filter((stock:any) => (stock.symbol.endsWith(".BO") || stock.symbol.endsWith(".NS")));
    const requiredStocks = ans.quotes;
    res.json({
        stockData : requiredStocks
    });
})

app.get("/history/:stock" ,async(req ,res)=>{
    const {stock} = req.params;
    const{range , interval} = req.query;
    const ans = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stock}?range=${range}&interval=${interval}`);
    const response = await ans.json();
    const data = response.chart.result[0].indicators.quote[0];
    if(!data.open){
        return res.status(401).json({
            message : "There is no enough data available"
        });
    } 
    let timeData = response.chart.result[0].timestamp;
    timeData = [...new Set(timeData)];
    
    const updatedData = [];
    for(let i = 0; i < data['open'].length;i++){
        if (
    timeData[i] == null ||         
    data.open[i] == null ||
    data.high[i] == null ||
    data.low[i] == null ||
    data.close[i] == null) {
    continue;
}
         const candleTime = Math.floor(timeData[i] / 60) * 60;
        if( updatedData.length>1 && candleTime == updatedData[updatedData.length-1].time - 19800){
        continue;            
        }
        updatedData.push({
            time: candleTime + 19800,
            open: data['open'][i],
            high: data['high'][i],
            volume: data['volume'][i], 
            low: data['low'][i],
            close: data['close'][i] 
        });
    }
    // give me the last candle
    console.log(updatedData[updatedData.length-1]);
    
    res.json({historyData : updatedData , 
        lastCandle : updatedData[updatedData.length-1]
    });
})

app.get("/buy/:stock" , authMiddleware ,  async(req ,res)=>{
    const {stock} = req.params;
    const {qty} = req.query;
    // now we need the latest price of the stocks
    const price = priceMap.get(stock);
    if(!price){ // that means no stock is found that means no live data
        return res.status(404).json({
        message: "No live data available for this stock",
    });
    }
    // now check if the user have enough balance to buy the stock

        try {
        const user = req.user;
        if(!user){
             return res.status(404).json({
                message: "User not found"
            });
        }
        // now we have the user as well so check its balance
        const userBalance = user.balanceLeft;
        if(userBalance < Number(qty) * price){
            // insuffiecient balance
            return res.status(404).json({
                message: "Insufficient Balance"
            });
        }

        // now the user have balance also the user exist also and also we have the live price of the stock then make the purchase

        // add the stock to the portfolio and reduce the balance
          const portfolio = await Port.findOne({
            owner : user._id
        });
        if(!portfolio){
            return res.status(404).json({
                message: "Portfolio Not Found"
            });
        }
        user.balanceLeft = userBalance - (Number(qty) * price);
        await user.save();
        // then add this to portfolio

    //    portfolio.stocks.push({
    //             name : stock , 
    //             qty : Number(qty) , 
    //             buy : price ,
    //             purchasedDate : new Date()
    //         });
        const index = portfolio.stocks.findIndex(obj => obj.name == stock);
        if(index == -1){
            // then this stock is not there just push
               portfolio.stocks.push({
                name : stock , 
                qty : Number(qty) , 
                buy : price ,
                purchasedDate : new Date()
            });
        }else{
            const holding = portfolio.stocks[index];
            const oldQty = holding?.qty;
            const oldAvg = holding?.buy;
            const newAvg = ((oldQty! * oldAvg!) + (Number(qty) * price))/(Number(qty) + oldQty!);
            portfolio.stocks[index] = {
                name : stock , 
                qty : oldQty! + Number(qty),
                buy : newAvg , 
                purchasedDate : new Date()
            }
        }
        // that means it already have that then we need to change the avg price and qty

    
            await portfolio.save();
            // now the order has been placeddd
            res.status(201).json({
                message : "Order places successfully" , 
                orderedPrice : price , 
                orderedQty : Number(qty) , 
                user : user
            });
        } catch (error) {
            return res.status(401).json({
                message : "Some error"
            })}
})

app.get("/sell/:stock" ,authMiddleware ,  async(req ,res)=>{
    const {stock} = req.params;
    const {qty} = req.query;
    // now we need the latest price of the stocks
    const price = priceMap.get(stock);
    if(!price){ // that means no stock is found that means no live data
        return res.status(404).json({
        message: "No live data available for this stock",
    });
    }
    // now check if the user have enough balance to buy the stock

        try {
           
        const user = req.user;
        if(!user){
             return res.status(404).json({
                message: "User not found"
            });
        }
        // now we have the user as well so check its balance
        const userBalance = user.balanceLeft;
        // now the user have balance also the user exist also and also we have the live price of the stock then make the purchase

        // add the stock to the portfolio and reduce the balance
          const portfolio = await Port.findOne({
            owner : user._id
        });
        if(!portfolio){
            return res.status(404).json({
                message: "Portfolio Not Found"
            });
        }

        
    //    portfolio.stocks.push({
    //             name : stock , 
    //             qty : Number(qty) , 
    //             buy : price ,
    //             purchasedDate : new Date()
    //         });
    const index = portfolio.stocks.findIndex(obj => obj.name == stock);
    if(index == -1){
        // that means we dont have this stock
        return res.status(401).json({
                message : "You dont have this stock"
            })}
            // that means we have this stock now check if we have enought qty
            if(Number(qty) > portfolio.stocks[index].qty){
                return res.status(401).json({
                message : "You dont have enough quantity of this stock"
            })
            }

            // now you have enought qty so you can sell
            // we will dec the qty of the stock and if the qty becomes zero we will remove it
            const oldQty = portfolio.stocks[index]?.qty;
            const oldPrice = portfolio.stocks[index]?.buy;
            portfolio.stocks[index] = {
                name : stock , 
                qty : oldQty - Number(qty),
                buy : oldPrice , 
                purchasedDate : portfolio.stocks[index]?.purchasedDate
            };

            if(portfolio.stocks[index]?.qty == 0){
                portfolio.stocks.splice(index , 1);
            }
            await portfolio.save();
            
            user.balanceLeft = userBalance + (Number(qty) * price);
            await user.save();
        //     await user.updateOne({
        //     balanceLeft : userBalance + (Number(qty) * price)
        // }); dont do this otherwise the user will not update whih we passing it only updates in the db
            // now the order has been placeddd
            
            res.status(201).json({
                message : "Stock Sold successfully" , 
                soldPrice : price , 
                soldQty : Number(qty) , 
                user : user
            })
        } catch (error) {
            return res.status(401).json({
                message : "Some error"
            })}
})

app.get("/portfolio" ,authMiddleware, async(req ,res)=>{
    // take the logged in user and give the portfolio
    try {
        const user = req.user;
        if(!user){
             return res.status(404).json({
                message: "User not found"
            });
        }
        // fetch the portfolio of the user
        const portfolio = await Port.findById(user.portfolio);
        if(!portfolio){
             return res.status(404).json({
                message: "PortFolio cant be fetched"
            });
        }
       res.status(201).json({
        portfolio : portfolio
       });
    } catch (error) {
         res.status(401).json({
        error : "Some error occured"
       });
    }

})


export default app;