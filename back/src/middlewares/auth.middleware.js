import jwt from "jsonwebtoken";
import Config from "../Config.js";
import SQLib from "../SQLib.js";

const sql = new SQLib();

export async function AuthMiddleware(req, res, next) {
	try {
		const authHeader = req.header("Authorization");
		if (!authHeader) return res.status(401).send();

		const token = authHeader.split(" ")[1];

		jwt.verify(token, Config.jwtSecret, (err, user) => {
			if (err) return res.sendStatus(401);
			req.user = user;
			return next();
		});
		const data = jwt.verify(token, Config.jwtSecret);
		if (!data)
			return res.status(401).send();
		req.user = await sql.findOne("USER", { id: data.user.id });
		return next();
	}
	catch (err) {
		// Expired token is an exception on jwt.verify()
		return res.sendStatus(401);
	}
}