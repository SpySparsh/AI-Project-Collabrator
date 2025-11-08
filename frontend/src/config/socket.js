import { io } from 'socket.io-client';

let socketInstance = null;

export const initiateSocket = (projectId) => {
    socketInstance = io(import.meta.env.VITE_API_URL, {
        query: {
            token: localStorage.getItem('token'),  // ✅ Send token in query params
            projectId
        },
        transports: ["websocket"] // Ensure WebSocket connection
    });

    return socketInstance;
};

export const receivemessage = (callback) => {
    if (socketInstance) {
        socketInstance.off('project-message'); // Remove previous listeners
        socketInstance.on('project-message', (message) => {
            callback(message);
        });
    }
};



export const sendMessage = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    }
};
