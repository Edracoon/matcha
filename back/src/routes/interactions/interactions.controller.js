import LikeSchema from "../../models/like.model.js";
import SQLib from "../../SQLib.js";
import SocketService from "../../services/socket.service.js";
import NotifSchema from "../../models/notif.model.js";
import ViewSchema from "../../models/view.model.js";
import UserSchema from "../../models/user.model.js";
import { Socket } from "socket.io";

const db = new SQLib();

async function updateFameRating(UserId) {
    const user = await db.findOne("USER", { id: UserId });

    const likes = await db.find("LIKES", { gotLiked: UserId});
    const views = await db.find("VIEW", { viewed: UserId });

    // Get unique viewers
    const uniqueViewers = [...new Set(views.map(view => view.viewer))];

    const fameRating = likes.length / (uniqueViewers.length || 1);

    if (fameRating > 1)
        fameRating = 1;

    await db.update("USER", { id: UserId }, { fameRating: fameRating });
}

const Distance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c / 1000; // in kilometres
}

class interactionsController {

    static async LikeInteraction(req, res) {
        if (!req.body.receiverId || !req.body.type)
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
            if (like.type === "like") {
                const isLikedBack = await db.findOne("LIKES", { type: "like", likedBy: receiverId, gotLiked: userId });

                // Check if the user is blocked
                const isBlocked = await db.findOne("BLOCKLIST", { didBlockId: receiverId, gotBlockId: userId });

                if (!isBlocked) {
                    let notif = {
                        senderId: userId,
                        receiverId: receiverId,
                        category: isLikedBack ? "liked_back" : "liked",
                        date: new Date(),
                        seen: false,
                    };
                    notif = await db.insert("NOTIF", notif);
                    SocketService.NotifHandler(notif);

                    if (isLikedBack) {
                        return res.status(200).json({ match: true });
                    }
                    updateFameRating(receiverId);
                }
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
            await db.delete("MESSAGE", { senderId: userId, receiverId: receiverId });
            await db.delete("MESSAGE", { senderId: receiverId, receiverId: userId });
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

    static async ViewInteraction(req, res) {
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
                const isBlocked = await db.findOne("BLOCKLIST", { didBlockId: receiverId, gotBlockId: userId });
                if (!isBlocked) {
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
            }
        } catch (e) {
            return res.status(400).json({ error: e });
        }
        return res.status(200).json();
    }

    static async BlockInteraction(req, res) {
        if (!req.body.receiverId)
            return res.status(400).json({ error: "Missing receiverId" });

        const userId = req.user.id;
        const receiverId = req.body.receiverId;

        const blockToInsert = {
            didBlockId: userId,
            gotBlockId: receiverId
        };

        try {
            await db.insert("BLOCKLIST", blockToInsert);
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

    static async GetNotifs(req, res) {
        const userId = req.user.id;

        try {
            const notifs = await db.find("NOTIF", { receiverId: userId });

            let returnNotifs = [];

            for (const notif of notifs) {
                const sender = await db.findOne("USER", { id: notif.senderId });
                returnNotifs.push({
                    sender: UserSchema.methods.formatSafeUser(sender),
                    notif : notif
                });
            }

            // console.log(returnNotifs);

            returnNotifs.sort((a, b) => b.notif.date - a.notif.date);
            
            return res.status(200).json(returnNotifs);
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        return res.status(200).json();
    }

    static async ReportUser(req, res) {
        const userId = req.user.id;

        if (!req.body.reportedId)
            return res.status(400).json({ error: "Missing reportedId" });

        const reportedId = req.body.reportedId;

        const reportToInsert = {
            reporter: userId,
            reported: reportedId,
        };

        try {
            await db.insert("REPORT", reportToInsert);
        } catch (e) {
            return res.status(400).json({ error: e });
        }
        return res.status(200).json();
    }

    static async GetMatches(req, res) {
        const userId = req.user.id;

        try {
            const likes = await db.find("LIKES", { type: "like" });

            const mutualLikes = [];

            likes.forEach((like) => {
                // Chercher un "like" réciproque
                const reciprocalLike = likes.find((l) => 
                    l.likedBy === like.gotLiked && l.gotLiked === like.likedBy && l.type === 'like' && like.type === 'like'
                );
                
                if (reciprocalLike) {
                    // Ajouter uniquement les utilisateurs qui ne sont pas déjà dans le tableau
                    if (!mutualLikes.some((m) => (m.likedBy === like.likedBy && m.gotLiked === like.gotLiked))) {
                        if (like.likedBy === userId || like.gotLiked === userId)
                            mutualLikes.push(like);
                    }
                }
            });

            let matches = [];

            for (const like of mutualLikes) {
            
                const user = await db.findOne("USER", { id: like.gotLiked === userId ? like.likedBy : like.gotLiked });
                const pictures = await db.find("PICTURE", { userId: user.id });


                user.distance = Distance(user.latitude, user.longitude, req.user.latitude, req.user.longitude);
                user.pictures = pictures.map(picture => picture.url);
                user.isConnected = SocketService.isConnected(user.id);

                if (user.id !== userId)
                    matches.push(UserSchema.methods.formatSafeUser(user));
            }


            const uniqueUsers = [...new Map(matches.map(user => [user.id, user])).values()];


            return res.status(200).json(uniqueUsers);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: e });
        }
    }

    static async UpdateNotifs(req, res) {

        if (!req.body.notifs)
            return res.status(400).json({ error: "Missing notifs" });

        const notifs = req.body.notifs;

        console.log(notifs);
        
        for (const notif of notifs) {
            await db.update("NOTIF", { id: notif.notif.id }, { seen: true });
        }

        const returnObject = [];

        const updatedNotifs = await db.find("NOTIF", { receiverId: req.user.id });


        for (let i = 0; i < updatedNotifs.length; i++) {
            const sender = await db.findOne("USER", { id: updatedNotifs[i].senderId });
            returnObject.push({sender, notif: updatedNotifs[i]});
        }

        returnObject.sort((a, b) => b.notif.date - a.notif.date);

        console.log("RETURN OBJH ->", returnObject);

        return res.status(200).json(returnObject);
    }

    static async GetMessages(req, res) {
        const userId = req.user.id;

        if (!req.body.receiverId)
            return res.status(400).json({ error: "Missing receiverId" });

        const receiverId = req.body.receiverId;

        try {
            const messages = await db.find("MESSAGE", { senderId: userId, receiverId: receiverId });
            messages.push(...await db.find("MESSAGE", { senderId: receiverId, receiverId: userId }));

            messages.sort((a, b) => a.date - b.date);
            return res.status(200).json(messages);
        } catch (e) {
            return res.status(400).json({ error: e });
        }
    }

    static async HasLiked (req, res) {
        const userId = req.user.id;

        if (!req.body.receiverId)
            return res.status(400).json({ error: "Missing receiverId" });

        const hasLiked = await db.findOne("LIKES", { likedBy: req.body.receiverId, gotLiked: userId });

        const isLikedBack = await db.findOne("LIKES", { likedBy: userId, gotLiked: req.body.receiverId });

        if (isLikedBack) {
            return res.status(200).json({ hasLiked: false });
        }

        return res.status(200).json({ hasLiked: hasLiked ? true : false });
    }

    static async IsMatch (req, res) {
        const userId = req.user.id;

        if (!req.body.receiverId)
            return res.status(400).json({ error: "Missing receiverId" });

        const hasLiked = await db.findOne("LIKES", { type: "like", likedBy: req.body.receiverId, gotLiked: userId });

        const isLikedBack = await db.findOne("LIKES", { type: "like", likedBy: userId, gotLiked: req.body.receiverId });

        if (hasLiked && isLikedBack) {
            return res.status(200).json({ isMatch: true });
        }
        return res.status(200).json({ isMatch: false});
    }

}

export default interactionsController;