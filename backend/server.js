import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
const URL=process.env.FRONTEND_URL;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: URL,
        credentials: true
    }
});
const PORT=process.env.PORT || 3000;
io.on("connection", (socket) => {
    console.log("New Client Connected");
    console.log("Socket is active to be connected");
    
    socket.on('join-room',({roomId, userName})=>{
        socket.join(roomId)
        socket.userName = userName
        socket.roomId = roomId
        socket.to(roomId).emit('user-connected',userName)
        console.log(`${userName} has joined the room: ${roomId}`);
    })
    socket.on("chat", (payload) => {
        console.log("Payload:", payload);
        socket.to(payload.roomId).emit("chat", { userName: payload.userName, message: payload.message, time: payload.time });
    })

    socket.on('disconnect',()=>{
        if(socket.userName){
            socket.to(socket.roomId).emit('user-disconnected',socket.userName)
        }
    })
});



httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


