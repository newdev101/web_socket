const socket = io('ws://localhost:3500')

const msgInput = document.querySelector('#message');
const nameInput = document.querySelector('#name');
const chatRoom = document.querySelector('#room');
const activity = document.querySelector('.activity');
const userList = document.querySelector('.user-list');
const roomList = document.querySelector('.room-list');
const chatDisplay = document.querySelector('.chat-display');


function sendMessage(e){
     e.preventDefault()
     if(nameInput.value && msgInput.value && chatRoom.value){
          socket.emit('message',{
               text: msgInput.value,
               name: nameInput.value,
          })
          msgInput.value= ""
     }
     msgInput.focus()
}

function enterRoom(e){
     e.preventDefault();
     if(nameInput.value && chatRoom.value){
          socket.emit('enterRoom',{
               name: nameInput.value,
               room: chatRoom.value,
          })
     }
}


//msg-input
document.querySelector('.form-msg')
     .addEventListener('submit',sendMessage)

//room-input
document.querySelector('.form-join')
     .addEventListener('submit',enterRoom)

//keypresing event
msgInput.addEventListener('keypress',()=>{
     socket.emit('activity',nameInput.value);
})

//listen for messages
socket.on("message",(data)=>{
     activity.textContent =''
     const li=document.createElement('li')
     li.textContent=data
     document.querySelector('ul').appendChild(li);
});




let activityTimer
socket.on("activity",(name)=>{
     activity.textContent = `${name} is typing...`

     clearTimeout(activityTimer)
     activityTimer = setTimeout(()=>{
          activity.textContent=""
     },3000);
});