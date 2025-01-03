import SQLib from "../SQLib.js";
import Config from "../Config.js";
import jwt from "jsonwebtoken";
import LikeSchema from "../models/like.model.js";

const db = new SQLib();

export let UsersSocket = [];

const Authenticate = async (token, socket) => {
    // console.log("Auth token", token);
    try {
        if (!token)
            return null;
        const data = jwt.verify(token, Config.jwtSecret);
    
        if (!data.user)
            return null;
        const user = await db.findOne("USER", { id: data.user.id });
        if (!user)
            return null;
        const UserSocket = UsersSocket.find((u) => u.id === data.user.id && socket === u.socket);
        if (!UserSocket) {
            UsersSocket.push({ id: data.user.id, socket });
        }
        return user;
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function isMatch(userId, receiverId) {
    try {
        const like1 = await db.findOne("LIKES", { likerId: userId, likedId: receiverId });
        const like2 = await db.findOne("LIKES", { likerId: receiverId, likedId: userId });
        return like1 && like2;
    } catch (e) {
        return false;
    }
}

// const isMatch = async (userId, receiverId) => {
//     try {
//         const like2 = await db.findOne("LIKES", { likerId: receiverId, likedId: userId });
//         const like1 = await db.findOne("LIKES", { likerId: userId, likedId: receiverId });
//         return like1 && like2;
//     } catch (e) {
//         return false;
//     }
// }

export default class SocketService {

    static async NotifHandler(Notif) {
        // console.log("Notif", Notif);
        const isBlocked = await db.findOne("BLOCKLIST", { didBlockId: Notif.receiverId, gotBlockId: Notif.senderId });
        const isOtherBlocked = await db.findOne("BLOCKLIST", { didBlockId: Notif.senderId, gotBlockId: Notif.receiverId });
        if (isBlocked || isOtherBlocked)
            return;
        const userSocket = UsersSocket.find((u) => u.id === Notif.receiverId);
        if (userSocket) {
            // console.log("User connected");
            const sender = await db.findOne("USER", { id: Notif.senderId });
            userSocket.socket.emit('Notif', { notif : Notif, sender});
        } else {
            // console.log("User not connected");
        }
    }

    static isConnected(userId) {
        return UsersSocket.find((u) => u.id === userId) ? true : false;
    }

    static async Handler(socket, io) {

        socket.on('auth', async (token) => {
            const user = await Authenticate(token, socket);
            if (!user)
                return;
            // console.log("User connected", user.id);
            io.emit('userConnected', user.id);
        });

        socket.on('manualDisconnect', async (token) => {
            const user = await Authenticate(token, socket);
            if (!user)
                return;
            console.log("User disconnected", user.id);
            io.emit('userDisconnected', {userId: user.id, lastConnection: new Date()});
            await db.update("USER", { id: user.id }, { lastConnection: new Date() });
            UsersSocket = UsersSocket.filter((u) => u.id !== user.id);
        });

        socket.on('disconnect', async () => {
            const socketDisconnected = UsersSocket.filter((u) => u.socket === socket);
            if (socketDisconnected) {
                for (const user of socketDisconnected) {
                    console.log("User disconnected", user.id);
                    io.emit('userDisconnected', {userId: user.id, lastConnection: new Date()});
                    await db.update("USER", { id: user.id }, { lastConnection: new Date() });
                    UsersSocket = UsersSocket.filter((u) => u.id !== user.id);
                }
            }
        });

        socket.on('sendMessage', async (data) => {
            const user = await Authenticate(data.token, socket);
            if (!user)
                return;
            if (data.receiverId && data.content) {
                const like1 = await db.findOne("LIKES", { type: "like", likedBy: user.id, gotLiked: data.receiverId });
                const like2 = await db.findOne("LIKES", { type: "like", likedBy: data.receiverId, gotLiked: user.id });
                if (!like1 || !like2)
                    return;
                const message = {
                    senderId: user.id,
                    receiverId: data.receiverId,
                    content: data.content,
                    date: new Date()
                };
                const notif = {
                    senderId: user.id,
                    receiverId: data.receiverId,
                    category: "message",
                    date: new Date(),
                    seen: false
                };
                try {
                    await db.insert("MESSAGE", message);
                    await db.insert("NOTIF", notif);
                    SocketService.NotifHandler(notif);
                    // const receiverSocket = UsersSocket.find((u) => u.id === data.receiverId);
                    const receiverSocket = UsersSocket.filter((u) => u.id !== user.id);
                    if (receiverSocket) {
                        receiverSocket.forEach((u) => {
                            u.socket.emit('receiveMessage', message);
                        });
                        // receiverSocket.socket.emit('receiveMessage', message);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }
}