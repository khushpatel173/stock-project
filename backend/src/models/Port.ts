
import mongoose , {Types} from "mongoose";

interface Stock{
    name : string , 
    qty : number, 
    buy : number ,
    purchasedDate : Date
};

interface Portfolio{
    stocks : Stock[] , 
    owner : Types.ObjectId
}

const portSchema = new mongoose.Schema<Portfolio>({
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


const Port = mongoose.model<Portfolio>("Port" , portSchema);
export default Port