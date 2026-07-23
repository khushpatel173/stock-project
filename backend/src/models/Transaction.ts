import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
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

export const Transaction = mongoose.model("Transaction" , transactionSchema);