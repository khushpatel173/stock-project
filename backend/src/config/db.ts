import mongoose from "mongoose";

const dbUrl = "mongodb://127.0.0.1:27017/trading-app";
// main().then(()=>{
//     console.log("connection successful");
// }).catch((err)=>{
//     console.log(err);
// })
// async function main(){
   
// }

export async function connectDb(){
    await mongoose.connect(dbUrl);
}

