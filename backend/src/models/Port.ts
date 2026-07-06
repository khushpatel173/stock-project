import string from "figlet/fonts/babyface-lame";
import mongoose, { mongo } from "mongoose";

const portSchema = new mongoose.Schema({
    stocks : [{
        name : {
            type : String
        } , 
        qty : {
            type : Number
        }, 
        buy : {
            type : Number
        } , 
        purchasedDate : {
            type : Date
        }
    }
    ] , 
    owner : mongoose.Schema.Types.ObjectId
});


const Port = mongoose.model("Port" , portSchema);
export default Port