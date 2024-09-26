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

            return true;
        })

        // Add Distance and CommonTags to each user
        // allUsers.map(user => {
        //     user.Distance = Distance(req.user.latitude, req.user.longitude, user.latitude, user.longitude);
        //     const userTags = tagUsers.filter(tagUser => tagUser.userId === user.id);
            
        //     // Calculer les tags en commun
        //     const commonTags = userTags.filter(userTag => 
        //         currentUserTags.some(currentTag => currentTag.tagId === userTag.tagId)
        //     ).length;

        //     user.CommonTags = commonTags;
            
        //     user.Score = getScore(user.fameRating, user.Distance, user.CommonTags);
        //     return user;
        // })
        // Define weights for the score calculation
        const fameWeight = 0.5;
        const distanceWeight = 0.3;
        const tagWeight = 0.2;

        // Calculate fame rating and score for each user
        allUsers = allUsers.map(user => {
            // Calculate Fame Rating (likes / views)
            const fameRating = (user.likesCounter / user.viewCounter) || 0;

            // Calculate Distance (already done in previous code)
            user.Distance = Distance(req.user.latitude, req.user.longitude, user.latitude, user.longitude);
            const distanceScore = 1 / (user.Distance || 1); // Avoid division by zero

            // Calculate common tags
            const userTags = tagUsers.filter(tagUser => tagUser.userId === user.id);
            const commonTags = userTags.filter(userTag => 
                currentUserTags.some(currentTag => currentTag.tagId === userTag.tagId)
            ).length;

            user.CommonTags = commonTags;

            // Calculate total score with weighted factors
            const totalScore = (fameRating * fameWeight) + (distanceScore * distanceWeight) + (commonTags * tagWeight);
            user.Score = totalScore;

            return user;
        });

        // Sort users by their score
        allUsers = allUsers.sort((a, b) => b.Score - a.Score);

        allUsers = allUsers.sort((a, b) => a.Score - b.Score);


        return res.status(200).json({ users: allUsers });
    }
}

export default SearchController;