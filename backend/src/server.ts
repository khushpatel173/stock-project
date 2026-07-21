import http from 'http';
import app from './app.js'
import { initWebSocket } from './sockets/yahoo.websocket.js';


export function startServer(){
    const server = http.createServer(app);
    // initialize websockets server and the whole logic
    initWebSocket(server);

server.listen(8080 , ()=>{
    console.log("Server listening to port 8080");
});
}