const express=require('express');
const app=express();
const path=require('path');
require('dotenv').config();
const http=require('http');
const socketIo=require('socket.io');

const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users.js');
const botName="My Chat App";
const PORT=process.env.PORT || 3000;
app.use(express.static(path.join(__dirname,'public')));
const server=http.createServer(app);
const io=socketIo(server);
//Run when client connects
io.on('connection',socket=>{
    //console.log('New connection ...');
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);

        //not sure
        socket.join(user.room);
        //socket.emit-this gives message to only logged user
    socket.emit('message',formatMessage(botName,'Welcome to Chatbot'));
    //BroadCast when user connects
    //only to others apart from logged user


    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has been connected`));

        //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        })
    })
    
    socket.on('chatMessage',(msg)=>{

        const user=getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })
    //To both logged user as well as other members
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));

            //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        })
        }  
    });    
})

server.listen(PORT,()=>{
    console.log(`Listening to port ${PORT}`);
})