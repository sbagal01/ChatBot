const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const rootName=document.getElementById('room-name');
const userList=document.getElementById('users');
const leaveRoom=document.getElementById('leave-btn');

//Get username and Role from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


//console.log(username,room);
const socket=io();
//Join chatroom
socket.emit('joinRoom',{username,room});

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message=>{
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

//Message submit
chatForm.addEventListener('submit',e=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;
    //Emit message
    socket.emit('chatMessage',msg);
    //Clear input
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();

})
leaveRoom.addEventListener('click',()=>{
    let leaveRoom=confirm('Are u sure u want to leave ?');
    if(leaveRoom){
        window.location='../index.html';
    }else{
        
    }
})
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    rootName.innerText=room;
}
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}    
    `
}