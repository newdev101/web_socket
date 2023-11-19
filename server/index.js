// import { createServer } from "http";
import express from 'express';
import { Server } from "socket.io";
import path  from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ||3500;
const ADMIN = "ADMIN"

// const httpServer = createServer();
const app = express();


//middleware
app.use(express.static(path.join(__dirname, "public")));



const expressServer = app.listen(PORT, ()=>{
     console.log(`listing to PORT=${PORT}`);
});

//   STATE
const UsersState = {
     users: [],
     setUsers: function(newUsersArray){
          this.users = newUsersArray
     }
}


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



//build message
function buildMsg(name, text){
     return{
          name,
          text,
          time: new Intl.DateTimeFormat('default',{
               hour: 'numeric',
               minute: 'numeric',
               second: 'numeric',
          }).format(new Date())
     }
}

//user functions
function activateUser(id, name, room){
     const user = {id, name, room}
     UsersState.setUsers([
          ...UsersState.users.filter(user => user.id != id),
          user
     ])
     return user
}

function userLeavesApp(id){
     UsersState.setUsers(
          UsersState.users.filter(user => user.id !== id)
     )
}

function getUser(id){
     return UsersState.users.find(user => user.id === id)
}


function getUsersInRoom(room){
     return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRooms(){
     return Array.from(new Set(UsersState.users.map(user => user.room)))
}