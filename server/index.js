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

