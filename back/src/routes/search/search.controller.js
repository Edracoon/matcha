import UserSchema from "../../models/user.model.js";
import SQLib from "../../SQLib.js";

const sql = new SQLib(); // Singleton

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

const getScore = (fameRating, distanceScore, tagScore) => {
    const fameWeight = 0.35;
    const distanceWeight = 0.55;
    const tagWeight = 0.1;

    const totalScore = (fameRating * fameWeight) + (distanceScore * distanceWeight) + (tagScore * tagWeight);
    return totalScore;
}

class SearchController {

    static async getAccordingUser(req, res) {
        let allUsers = await sql.findAll("USER");
        const likedUsers = await sql.find("LIKES", { likedBy: req.user.id });
        const blockedUsers = await sql.find("BLOCKLIST", { didBlockId: req.user.id });
        const tagUsers = await sql.findAll("TAG_USER");
        const tags = await sql.findAll("TAG");

        const currentUserTags = await sql.find("TAG_USER", { userId: req.user.id });

        allUsers = allUsers.filter(user => user.id !== req.user.id);

        // Filter users that are not blocked, not liked or not according sexuality
        allUsers = allUsers.filter(user => {
            if (likedUsers.find(like => like.likedBy === req.user.id)) 
                return false;
            if (blockedUsers.find(block => block.didBlockId === req.user.id)) 
                return false;
            if (req.user.wantToMeet === "anyone") 
                return true;
            else if (req.user.wantToMeet === "men" && user.gender !== "man")
                return false;
            else if (req.user.wantToMeet === "women" && user.gender !== "woman")
                return false;
            else if (user.wantToMeet === "men" && req.user.gender !== "man")
                return false;
            else if (user.wantToMeet === "women" && req.user.gender !== "woman")
                return false;

            return true;
        })

        const fameWeight = 0.3;
        const distanceWeight = 0.7;
        const tagWeight = 0.1;

        allUsers = allUsers.map(user => {
            const fameRating = (user.likesCounter / user.viewCounter) || 0;

            user.Distance = Distance(req.user.latitude, req.user.longitude, user.latitude, user.longitude);
            const maxDistance = 10000; 
            const distanceScore = 1 - Math.min(user.Distance / maxDistance, 1);
            
            const userTags = tagUsers.filter(tagUser => tagUser.userId === user.id);
            const commonTags = userTags.filter(userTag => 
                currentUserTags.some(currentTag => currentTag.tagId === userTag.tagId)
            ).length;

            user.CommonTags = commonTags;

            const totalScore = (fameRating * fameWeight) + (distanceScore * distanceWeight) + (commonTags / (currentUserTags.length || 1) * tagWeight);
            user.Score = totalScore;

            return UserSchema.methods.formatSafeUser(user);
        });

        allUsers = allUsers.sort((a, b) => b.Score - a.Score);

        return res.status(200).json({ users: allUsers });
    }

    static async GetUserWithFilter(req, res) {
        const filter = ["ageGap", "fameGap", "distanceGap", "tags"];
        const ageGap = req.body["ageGap"];
        const fameGap = req.body["fameGap"];
        const distanceGap = req.body["distanceGap"];
        const tagsFilter = req.body["tags"];

        let allUsers = await sql.findAll("USER");
        const likedUsers = await sql.find("LIKES", { likedBy: req.user.id });
        const blockedUsers = await sql.find("BLOCKLIST", { didBlockId: req.user.id });
        const tagUsers = await sql.findAll("TAG_USER");
        const tags = await sql.findAll("TAG");

        const currentUserTags = await sql.find("TAG_USER", { userId: req.user.id });

        allUsers = allUsers.filter(user => user.id !== req.user.id);

        // Filter users that are not blocked, not liked or not according sexuality
        allUsers = allUsers.filter(user => {
            if (likedUsers.find(like => like.likedBy === req.user.id)) 
                return false;
            if (blockedUsers.find(block => block.didBlockId === req.user.id)) 
                return false;
            if (req.user.wantToMeet === "anyone") 
                return true;
            else if (req.user.wantToMeet === "men" && user.gender !== "man")
                return false;
            else if (req.user.wantToMeet === "women" && user.gender !== "woman")
                return false;
            else if (user.wantToMeet === "men" && req.user.gender !== "man")
                return false;
            else if (user.wantToMeet === "women" && req.user.gender !== "woman")
                return false;
            
            // Process to apply filters from request
            if (ageGap && (ageGap.max || ageGap.min)) {
                if (user.age > ageGap.max || user.age < ageGap.min)
                    return false;
            }
            const fameWeight = 0.3;
            const distanceWeight = 0.7;
            const tagWeight = 0.1;
            const fameRating = (user.likesCounter / user.viewCounter) || 0;

            const maxDistance = 10000; 
            const distanceScore = 1 - Math.min(user.Distance / maxDistance, 1);
            
            const userTags = tagUsers.filter(tagUser => tagUser.userId === user.id);
            const commonTags = userTags.filter(userTag => 
                currentUserTags.some(currentTag => currentTag.tagId === userTag.tagId)
            ).length;

            user.CommonTags = commonTags;

            const totalScore = (fameRating * fameWeight) + (distanceScore * distanceWeight) + (commonTags / (currentUserTags.length || 1) * tagWeight);
            user.Score = totalScore;
            if (fameGap && (fameGap.max || fameGap.min)) {
                if (user.fameRating > fameGap.max || user.fameRating < fameGap.min)
                    return false;
            }
            if (distanceGap && (distanceGap.max || distanceGap.min)) {
                user.Distance = Distance(req.user.latitude, req.user.longitude, user.latitude, user.longitude);
                if (user.Distance > distanceGap.max || user.Distance < distanceGap.min)
                    return false;
            }
            const currentTag = tagUsers.filter(tagUser => tagUser.userId === user.id);
            user.tags = currentTag.map(tag => tags.find(t => t.id === tag.tagId).content);
            if (tagsFilter && tagsFilter.length) {

                
                // if (tagsFilter.length > currentTag.length)
                //     return false;
                if (!tagsFilter.every(t => user.tags.includes(t)))
                    return false;
            }
            return true;
        })

        allUsers = allUsers.map(user => {
            // const fameRating = (user.likesCounter / user.viewCounter) || 0;

            // const maxDistance = 10000; 
            // const distanceScore = 1 - Math.min(user.Distance / maxDistance, 1);
            
            // const userTags = tagUsers.filter(tagUser => tagUser.userId === user.id);
            // const commonTags = userTags.filter(userTag => 
            //     currentUserTags.some(currentTag => currentTag.tagId === userTag.tagId)
            // ).length;

            // user.CommonTags = commonTags;

            // const totalScore = (fameRating * fameWeight) + (distanceScore * distanceWeight) + (commonTags / (currentUserTags.length || 1) * tagWeight);
            // user.Score = totalScore;

            return UserSchema.methods.formatSafeUser(user);
        });

        allUsers = allUsers.sort((a, b) => b.Score - a.Score);

        return res.status(200).json({ users: allUsers });

    }
}

export default SearchController;