import axios from "axios";
class DataService{

    async getData(){
        const res = await axios.get("http://localhost:8080/getStocks")
    }
}
const dataServive = new DataService();
export default dataServive