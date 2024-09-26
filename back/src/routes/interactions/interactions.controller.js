import LikeSchema from "../../models/like.model.js";
import SQLib from "../../SQLib.js";
import SocketService from "../../services/socket.service.js";
import NotifSchema from "../../models/notif.model.js";
import ViewSchema from "../../models/view.model.js";

const db = new SQLib();

async function updateFameRating(User) {
    const user = await db.findOne("USER", { id: User.id });

    const likes = await db.find("LIKES", { gotLiked: User.id });
    const views = await db.find("VIEW", { viewed: User.id });

    const fameRating = likes.length / (views.length || 1);

    await db.update("USER", { id: User.id }, { fameRating: fameRating });
}
class interactionsController {



    static async LikeInteraction(req, res) {
        if (!req.body.receiverId)
            return res.status(400).json({ error: "Missing receiverId" });

        const userId = req.user.id;
        const receiverId = req.body.receiverId;

        const likeToInsert = {
            type: req.body.type,
            likedBy: userId,
            gotLiked: receiverId
        }

        try {
            const like = await db.insert("LIKES", likeToInsert);
            const isLikedBack = await db.findOne("LIKES", { type: "like", likedBy: receiverId, gotLiked: userId });
            if (like.type === "like") {
                const notif = {
                    senderId: userId,
                    receiverId: receiverId,
                    category: isLikedBack ? "liked_back" : "liked",
                    date: new Date(),
                    seen: false,
                };
                await db.insert("NOTIF", notif);
                SocketService.NotifHandler(notif);

                if (isLikedBack) {
                    return res.status(200).json({ match: true });
                }
                updateFameRating(receiverId);
            }
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: e });
        }
        return res.status(200).json({ match: false });
    }

    static async UnlikeInteraction(req, res) {
        if (!req.body.receiverId)
            return res.status(400).json({ error: "Missing receiverId" });

        const userId = req.user.id;
        const receiverId = req.body.receiverId;

        try {
            await db.delete("LIKES", { likedBy: userId, gotLiked: receiverId });
            await db.delete("LIKES", { likedBy: receiverId, gotLiked: userId });
            await db.delete("NOTIF", { senderId: userId, receiverId: receiverId, category: "liked" });
            await db.delete("NOTIF", { senderId: receiverId, receiverId: userId, category: "liked" });
            const notif = {
                senderId: userId,
                receiverId: receiverId,
                category: "unliked",
                date: new Date(),
                seen: false,
            };
            await db.insert("NOTIF", notif);
            SocketService.NotifHandler(notif);
            updateFameRating(receiverId);
        } catch (e) {
            return res.status(400).json({ error: e });
        }
        return res.status(200).json();
    }

    static async ViewInteractions(req, res) {
        if (!req.body.receiverId)
            return res.status(400).json({ error: "Missing receiverId" });

        const userId = req.user.id;
        const receiverId = req.body.receiverId;

        const viewToInsert = {
            viewer: userId,
            viewed: receiverId
        }

        try {
            const view = await db.insert("VIEW", viewToInsert);
            if (view) {
                const notif = {
                    senderId: userId,
                    receiverId: receiverId,
                    category: "visited",
                    date: new Date(),
                    seen: false,
                };
                await db.insert("NOTIF", notif);
                SocketService.NotifHandler(notif);
                updateFameRating(receiverId);
            }
        } catch (e) {
            return res.status(400).json({ error: e });
        }
        return res.status(200).json();
    }
}

export default interactionsController;