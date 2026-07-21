import { priceMap } from "./map.js";
import Port from "../models/Port.js";

async function buyStock(user , stock , qty , price , order){
   
    // now check if the user have enough balance to buy the stock

        try {
        // now we have the user as well so check its balance
        const userBalance = user.balanceLeft;
        if(userBalance < Number(qty) * price){
            // insuffiecient balance
            throw new Error("Insufficient balance");
        }

        // now the user have balance also the user exist also and also we have the live price of the stock then make the purchase

        // add the stock to the portfolio and reduce the balance
          const portfolio = await Port.findOne({
            owner : user._id
        });
        if(!portfolio){
            throw new Error("No portfolio found")
        }
        user.balanceLeft = userBalance - (Number(qty) * price);
        await user.save();
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
         order.status = "EXECUTED";
         order.executedAt = Date.now();
         order.executedPrice = price * qty;
    await order.save();
        } catch (error) {

            order.status = "REJECTED";
            await order.save();
           throw new Error("Some error");
        }
}

async function sellStock(user , stock , qty , price , order){
     try {
           
        // now we have the user as well so check its balance
        const userBalance = user.balanceLeft;
        // now the user have balance also the user exist also and also we have the live price of the stock then make the purchase

        // add the stock to the portfolio and reduce the balance
          const portfolio = await Port.findOne({
            owner : user._id
        });
        if(!portfolio){
           throw new Error("Portfolio not found");
        }
    const index = portfolio.stocks.findIndex(obj => obj.name == stock);
    if(index == -1){
        // that means we dont have this stock
       throw new Error("You dont have this stock")
        }
            // that means we have this stock now check if we have enought qty
            if(Number(qty) > portfolio.stocks[index].qty){
              throw new Error("You dont have enough quantity of this stock");
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
        order.status = "EXECUTED";
         order.executedAt = Date.now();
         order.executedPrice = price*qty;
    await order.save();
        } catch (error) {
            order.status = "REJECTED";
            await order.save();
           throw new Error("Some error");
           
        }
}
export {buyStock , sellStock}