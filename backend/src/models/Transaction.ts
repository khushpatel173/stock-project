import mongoose, { Types } from "mongoose";

export enum transactionType {
    BUY="BUY" , SELL="SELL"
};

interface Transaction{
      user : Types.ObjectId , 
      type : transactionType     , 
      amount : number , 
};

const transactionSchema = new mongoose.Schema<Transaction>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: [
            "BUY",
            "SELL"
        ],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
} , {timestamps : true});

export const Transaction = mongoose.model<Transaction>("Transaction" , transactionSchema);

