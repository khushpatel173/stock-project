import mongoose from "mongoose";
import {Types} from 'mongoose'

enum orderType{
    BUY="BUY" , SELL="SELL"
}
enum status {
    PENDING="PENDING" , EXECUTED="EXECUTED" , REJECTED="REJECTED"
}
enum type {
    Market="Market" , Limit="Limit"
}
interface Order {
    user : Types.ObjectId , 
    type : orderType , 
    status : status , 
    createdAt : Date , 
    executedAt : Date , 
    symbol : string ,
    requestedPrice : number , 
    executedPrice : number , 
    orderType : type , 
    qty : number
};

const orderSchema = new mongoose.Schema<Order>({
    user : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User" , 
        required : true
    },
    type : {
        type : String , 
        enum : Object.values(orderType) , 
        required : true
    } , 
    status : {
        type : String , 
        enum : Object.values(status) , 
        required : true
    } , 
    createdAt : {
        type : Date , 
        required : true
    } , 
    executedAt : {
        type : Date , required : true
    } , 
    symbol : {
        type : String , 
        required : true
    } ,
    requestedPrice : {
        type : Number , required : true
    } , 
    executedPrice : {
        type : Number , required : true
    } , 
    orderType : {
        type : String, 
        enum : Object.values(type) , 
        required : true
    } , 
    qty : {
        type : Number , 
        required : true
    }
});

const Order = mongoose.model<Order>("Order" , orderSchema);
export default Order;
