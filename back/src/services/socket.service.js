import SQLib from "../SQLib.js";
import Config from "../Config.js";
import jwt from "jsonwebtoken";
import LikeSchema from "../models/like.model.js";

const db = new SQLib();

export const UsersSocket = [];

const Authenticate = async (token, socket) => {
    const data = jwt.verify(token, Config.jwtSecret);

    if (!data.user)
        return null;
    const user = await db.findOne("USER", { id: data.user.id });
    if (!user)
        return null;
    const UserSocket = UsersSocket[data.user.id];
    if (!UserSocket) {
        UsersSocket[data.user.id] = socket;
    }
    return user;
}

export default class SocketService {

    static async NotifHandler(Notif) {
        const userSocket = UsersSocket[Notif.receiverId];
        if (userSocket) {
            userSocket.emit('Notif', Notif);
        }
    }

    static async Handler(socket, io) {

        socket.on('sendMessage', async (data) => {
            const user = await Authenticate(data.token, socket);
            if (!user)
                return;
            if (data.receiverId && data.content) {
                let message = {
                    senderId: user.id,
                    receiverId: data.receiverId,
                    content: data.content,
                    date: new Date()
                };
                try {
                    await db.insert("MESSAGE", message);
                    const receiverSocket = UsersSocket[data.receiverId];
                    if (receiverSocket) {
                        receiverSocket.emit('receiveMesage', message);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }
}