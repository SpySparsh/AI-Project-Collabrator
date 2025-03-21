import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectmodels from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port=process.env.PORT||3000;


const server=http.createServer(app);
const io = new Server(server,
{
cors:{
    origin:'*'
}
})

io.use(async (socket, next) => {
    try {
        console.log("🔍 Socket Handshake Query:", socket.handshake.query);

        const token = socket.handshake.query.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!token) {
            console.log("❌ No token provided");
            return next(new Error("Unauthorized User"));
        }

        console.log("✅ Received Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            console.log("❌ Invalid Token");
            return next(new Error("Unauthorized User"));
        }

        console.log("✅ Token Verified:", decoded);
        socket.user = decoded;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            console.log("❌ Invalid Project ID:", projectId);
            return next(new Error("Invalid Project ID"));
        }

        socket.project = await projectmodels.findById(projectId);
        if (!socket.project) {
            console.log("❌ Project Not Found:", projectId);
            return next(new Error("Project Not Found"));
        }

        next();
    } catch (error) {
        console.log("❌ Error in socket middleware:", error.message);
        next(new Error("Unauthorized User"));
    }
});


io.on('connection', (socket) => {
    socket.roomId = socket.project._id.toString();
    console.log('✅ A user connected to project:', socket.project?._id);

    socket.join(socket.roomId);

    // Handle incoming messages
    socket.on('project-message', async data => {

        const message = data.message;

        const aiIspresent =message.includes('@ai');
        if(aiIspresent){
            socket.broadcast.to(socket.roomId).emit('project-message', data);
            const prompt = message.replace('@ai','');
            const response = await generateResult(prompt);

            io.to(socket.roomId).emit('project-message', {
                message: response,
                sender: {
                    _id: "ai",
                    email: 'AI'
                }

            });

            return;
        }


        console.log("📩 Message received:", data);
        socket.broadcast.to(socket.roomId).emit('project-message', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log("❌ User disconnected");
    });
});


server.listen(port,()=>{
    console.log(`Server running on ${port}`);
})