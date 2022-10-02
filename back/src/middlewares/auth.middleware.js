import jwt from "jsonwebtoken";
import Config from "../Config.js";

export const AuthMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.sendStatus(401);

	const token = authHeader.split(" ")[1];
	console.log("authenticateJWT -> ", token);

	jwt.verify(token, Config.JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(401);
		req.user = user;
		return next();
	});
}
