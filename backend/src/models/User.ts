import mongoose, { mongo } from "mongoose";

interface IUser {
    googleId: string;
    name: string;
    email: string;
    picture: string;
    portfolio: mongoose.Types.ObjectId;
    balanceLeft : number;
}


const userSchema = new mongoose.Schema<IUser>({
     googleId : {
        type : String
     } , 
     name : {
        type : String
     } , 
     picture : {
        type : String
     } , 
     email : {
        type : String
     } , 
     portfolio : {
      type : mongoose.Schema.Types.ObjectId
     } , 
     balanceLeft : {
      type : Number , 
      default : 1000000
     } , 
});

const User = mongoose.model<IUser>("User" , userSchema);
export default User;