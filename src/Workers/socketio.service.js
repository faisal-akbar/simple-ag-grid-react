/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import { io } from 'socket.io-client';
import { SOCKET_URL } from './constants';

let socket;
export const initiateSocketConnection = (room) => {
    socket = io(SOCKET_URL);
    // socket = io(process.env.REACT_APP_SOCKET_URL, {
    //     auth: {
    //         token: 'cde',
    //     },
    // });
    console.log(`Connecting socket...`);
};
export const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if (socket) socket.disconnect();
};
// eslint-disable-next-line consistent-return
export const subscribeToInitialData = (cb) => {
    socket.emit('my message', 'Hello there from React.');
    if (!socket) return true;
    socket.on('sow', (msg) => {
        console.log('Websocket event received!');
        return cb(null, msg);
    });
};
export const subscribeToStreamData = (cb) => {
    socket.emit('my message', 'Hello there from React.');
    if (!socket) return true;
    socket.on('subscribe', (msg) => {
        console.log('Websocket event received Streaming!');
        return cb(null, msg);
    });
};
export const sendMessage = (room, message) => {
    if (socket) socket.emit('chat', { message, room });
};
