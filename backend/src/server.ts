import http from 'http';
import app from './app.js'
import { initWebSocket } from './sockets/yahoo.websocket.js';
import dotenv from 'dotenv'


dotenv.config();

export function startServer(){
    const server = http.createServer(app);
    // initialize websockets server and the whole logic
    initWebSocket(server);
    const PORT = process.env.PORT || 8080;
server.listen( PORT, ()=>{
    console.log("Server listening to port 8080");
});
}