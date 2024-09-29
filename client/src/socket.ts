import { io, Socket } from "socket.io-client";

const URL = 'http://localhost:4242';

const socket: Socket = io(URL, {
    autoConnect: false, // Ne pas auto-connecter
});

socket.connect();

const accessToken = document.cookie.split('=')[1].split(';')[0];


socket.emit('auth', accessToken);


export { socket };

export function handleDisconnectWithData(accessToken: any) {
    // Émettre un événement personnalisé avant de se déconnecter
    socket.emit('manualDisconnect', accessToken );

    // Ensuite, déconnecter le socket proprement
    socket.disconnect();
}