// import { createServer } from "http";
import express from 'express';
import { Server } from "socket.io";
import path  from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ||3500;

// const httpServer = createServer();
const app = express();


//middleware
app.use(express.static(path.join(__dirname, "public")));



const expressServer = app.listen(PORT, ()=>{
     console.log(`listing to PORT=${PORT}`);
});

const io = new Server(expressServer,{
     //cros origin resource sharing
     cors:{
          origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500",'http://127.0.0.1:5500']
     }
});

io.on('connection',socket=>{
     console.log(`user${socket.id} connected`);

     //upon connection to new user
     socket.emit('message',"🙋️ welcome to chat‼️");

     //upon connection to all others
     socket.broadcast.emit('message',`🆕️ new ${socket.id.substring(0,5)} connected`)

     //listening to messages
     socket.on('message',data=>{
          console.log(`${socket.id.substring(0,5)} : ${data}`);
          io.emit('message',`${socket.id.substring(0,5)} : ${data}`);
     });

     //when user disconnects to all other users
     socket.on('disconnect',()=>{
     socket.broadcast.emit('message',`🤦‍♀️️ ${socket.id.substring(0,5)} disconnected`)
     })


     //listen for activity
     socket.on('activity',(name)=>{
     socket.broadcast.emit('activity',name)
     })
});

