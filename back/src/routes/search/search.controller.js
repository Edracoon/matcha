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
		const askingUser = req.user;

        let allUsers = await sql.findAll("USER");
        const likedUsers = await sql.find("LIKES", { likedBy: askingUser.id });
        const blockedUsers = await sql.find("BLOCKLIST", { didBlockId: askingUser.id });
        const tagUsers = await sql.findAll("TAG_USER");
        const tags = await sql.findAll("TAG");

        const currentUserTags = await sql.find("TAG_USER", { userId: askingUser.id });

        allUsers = allUsers.filter(user => user.id !== askingUser.id);

        allUsers = allUsers.filter(user => {
            if (likedUsers.find(like => like.likedBy === askingUser.id)) 
                return false;
            if (blockedUsers.find(block => block.didBlockId === askingUser.id)) 
                return false;
            if (askingUser.wantToMeet === "anyone") 
                return true;
            else if (askingUser.wantToMeet === "men" && user.gender !== "man")
                return false;
            else if (askingUser.wantToMeet === "women" && user.gender !== "woman")
                return false;
            else if (user.wantToMeet === "men" && askingUser.gender !== "man")
                return false;
            else if (user.wantToMeet === "women" && askingUser.gender !== "woman")
                return false;

            return true;
        })

        const fameWeight = 0.3;
        const distanceWeight = 0.7;
        const tagWeight = 0.1;

        allUsers = allUsers.map(user => {
            const fameRating = (user.likesCounter / user.viewCounter) || 0;

            user.Distance = Distance(askingUser.latitude, askingUser.longitude, user.latitude, user.longitude);
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
		const askingUser = req.user;

        const ageGap = req.body["ageGap"];
        const fameGap = req.body["fameGap"];
        const distanceGap = req.body["distanceGap"];
        const tagsFilter = req.body["tags"];

        let allUsers = await sql.findAll("USER");
        const likedUsers = await sql.find("LIKES", { likedBy: askingUser.id });
        const blockedUsers = await sql.find("BLOCKLIST", { didBlockId: askingUser.id });
        const tagUsers = await sql.findAll("TAG_USER");
        const tags = await sql.findAll("TAG");

        const currentUserTags = await sql.find("TAG_USER", { userId: askingUser.id });

        allUsers = allUsers.filter(user => user.id !== askingUser.id);

        allUsers = allUsers.filter(user => {
            // Si le askingUser.id l'a deja like alors on ne le renvoie pas
            const l = likedUsers.find(like => like.likedBy === askingUser.id && like.gotLiked === user.id);
            if (l) 
                return false;

            // Si le user a bloqué le askingUser.id alors on ne le renvoie pas
            const b = blockedUsers.find(block => block.didBlockId === askingUser.id && block.gotBlockId === user.id);
            if (b) 
                return false;

			// Si je cherche n'importe qui et que le user cherche n'importe qui
			if ((askingUser.wantToMeet === "anyone" && user.wantToMeet === "anyone") ||
				// Si je cherche n'importe qui et que le user cherche des hommes et que je suis un homme
				(askingUser.wantToMeet === "anyone" && (user.wantToMeet === "men" && askingUser.gender === "man")) ||
				// Si je cherche n'importe qui et que le user cherche des femmes et que je suis une femme
				(askingUser.wantToMeet === "anyone" && (user.wantToMeet === "women" && askingUser.gender === "woman")))
				;
			// Si cherche n'importe qui et que les conditions ci-dessus ne sont pas respectees
			else if (askingUser.wantToMeet === "anyone")
				return false;

			// Si je cherche des hommes et que ce n'est pas un homme
            if (askingUser.wantToMeet === "men" && user.gender !== "man")
                return false;
			// Si je cherche des femmes et que ce n'est pas une femme
            else if (askingUser.wantToMeet === "women" && user.gender !== "woman")
                return false;
			// Si je suis un homme et que le user ne cherche pas un homme
            else if (askingUser.gender === "man" && (user.wantToMeet !== "men" && user.wantToMeet !== "anyone"))
                return false;
			// Si je suis une femme et que le user ne cherche pas une femme
            else if (askingUser.gender === "woman" && (user.wantToMeet !== "women" && user.wantToMeet !== "anyone"))
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
            user.Distance = Distance(askingUser.latitude, askingUser.longitude, user.latitude, user.longitude);
            const distanceScore = 1 - (user.Distance / maxDistance);
            
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
            if (distanceGap && (distanceGap.max)) {
                distanceGap.min = 0;
                if (user.Distance > distanceGap.max)
                    return false;
            }
            const currentTag = tagUsers.filter(tagUser => tagUser.userId === user.id);
            user.tags = currentTag.map(tag => tags.find(t => t.id === tag.tagId).content);
            if (tagsFilter && tagsFilter.length) {
                if (!tagsFilter.every(t => user.tags.includes(t)))
                    return false;
            }
            return true;
        })

        allUsers = allUsers.sort((a, b) => b.Score - a.Score);

        allUsers = allUsers.slice(0, 32);

        for (let i = 0; i < allUsers.length; i++) {
            const pictures = await sql.find("PICTURE", { userId: allUsers[i].id });
            allUsers[i].pictures = pictures.map(picture => picture.url);
        }


        return res.status(200).json({ users: allUsers.map(user => UserSchema.methods.formatSafeUser(user)) });

    }
}

export default SearchController;