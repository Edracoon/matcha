import { io, Socket } from "socket.io-client";

const URL = 'http://localhost:4242';

// please note that the types are reversed
export const socket: Socket<any, any> = io(URL, {
	autoConnect: false
});
