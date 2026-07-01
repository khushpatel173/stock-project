import mongoose from "mongoose";

interface IUser {
    googleId: string;
    name: string;
    email: string;
    picture: string;
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
     }
});

const User = mongoose.model<IUser>("User" , userSchema);
export default User;