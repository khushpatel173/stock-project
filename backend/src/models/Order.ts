import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User"
    },
    type : {
        type : String , 
        enum : ["BUY" , "SELL"]
    } , 
    status : {
        type : String , 
        enum : ["PENDING" , "EXECUTED" , "REJECTED"]
    } , 
    createdAt : {
        type : Date
    } , 
    executedAt : {
        type : Date
    } , 
    symbol : {
        type : String 
    } ,
    requestedPrice : {
        type : Number
    } , 
    executedPrice : {
        type : Number
    } , 
    orderType : {
        type : String, 
        enum : ["Market" , "Limit"]
    }
});

const Order = mongoose.model("Order" , orderSchema);
export default Order;
