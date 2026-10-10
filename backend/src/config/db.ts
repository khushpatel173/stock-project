import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
// const dbUrl = "mongodb://127.0.0.1:27017/trading-app";
const dbUrl: string =  process.env.MONGO_URL as string;
// main().then(()=>{
//     console.log("connection successful");
// }).catch((err)=>{
//     console.log(err);
// })
// async function main(){
   
// }

export async function connectDb() : Promise<void>{
    await mongoose.connect(dbUrl);
}

