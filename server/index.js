import { createServer } from "http";
import { Server } from "socket.io";



const httpServer = createServer();
const io = new Server(httpServer,{
     //cros origin resource sharing
     cors:{
          origin: process.env.NODE_ENV === "production" ? flase : ["htttp://localhost:5500",'http://127.0.0.1:5500']
     }
});

io.on('connection',socket=>{
     console.log(`user${socket.id} connected`);
     socket.on('message',data=>{
         
          console.log(data);
          io.emit('message',`${socket.id.substring(0,5)} : ${data}`);
     });
});


httpServer.listen(3500, ()=>console.log('listining i on 3500'));